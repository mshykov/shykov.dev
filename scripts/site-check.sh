#!/usr/bin/env bash
# Daily availability + TLS-expiry check for the public sites.
# Run by .github/workflows/site-monitor.yml; runs the same locally:
#   bash scripts/site-check.sh
# Prints a Markdown report on stdout; exits 1 if any check fails.
#
# Per site: follow redirects, require HTTP 200 and a keyword in the body
# (the SPA fallbacks answer 200 for anything, so status alone proves little),
# then require every TLS certificate on the way (first and final host) to be
# valid for more than WARN_DAYS. Behind the Cloudflare proxy that certificate
# is Cloudflare's edge cert; an expired *origin* cert shows up as a 526
# instead, which the status check catches (local-review, 2026-09-20..28).
set -uo pipefail

WARN_DAYS="${WARN_DAYS:-14}"

# url|keyword — keyword is matched literally and case-sensitively.
SITES=(
  "https://shykov.dev/|Maksym Shykov"
  "https://cv.shykov.dev/|ATS Resume Checker"
  "https://local-review.shykov.dev/|local-review"
  "https://moat.shykov.dev/|Zero to Moat"
  "https://www.coffeeslack.com/|CoffeeSlack"
  "https://aploma.dev/|Aploma"
  "https://alotno.app/|Alotno"
)

failures=0
rows=()

join() { # separator items... -> items joined by separator
  local sep=$1 out=$2
  shift 2
  for item in "$@"; do out+="$sep$item"; done
  echo "$out"
}

cert_check() { # host -> prints "notAfter" date; returns 1 if expiring, 2 if unreadable
  local host=$1 pem end
  pem=$(openssl s_client -connect "$host:443" -servername "$host" </dev/null 2>/dev/null |
    openssl x509 2>/dev/null) || { echo "unreadable"; return 2; }
  end=$(openssl x509 -noout -enddate <<<"$pem" | cut -d= -f2)
  echo "$end"
  openssl x509 -noout -checkend $((WARN_DAYS * 86400)) <<<"$pem" >/dev/null
}

fetch() { # url -> sets code, final, body
  local out
  body=$(mktemp)
  out=$(curl -sSL --max-time 20 -o "$body" -w '%{http_code} %{url_effective}' \
    -A 'shykov.dev-site-monitor' "$1" 2>/dev/null) || true
  code=${out%% *}
  final=${out#* }
}

for entry in "${SITES[@]}"; do
  url=${entry%%|*}
  keyword=${entry#*|}
  problems=()

  fetch "$url"
  # One retry after a pause, so a single blip doesn't open an issue.
  if [[ $code != 200 ]] || ! grep -qF -- "$keyword" "$body"; then
    rm -f "$body"
    sleep 20
    fetch "$url"
  fi
  if [[ $code != 200 ]]; then
    problems+=("HTTP ${code:-none}")
  elif ! grep -qF -- "$keyword" "$body"; then
    problems+=("keyword \"$keyword\" missing")
  fi
  rm -f "$body"

  host=$(sed -E 's#^https?://([^/:]+).*#\1#' <<<"$url")
  hosts=("$host")
  final_host=$(sed -E 's#^https?://([^/:]+).*#\1#' <<<"$final")
  [[ $final == http* && $final_host != "$host" ]] && hosts+=("$final_host")

  certs=()
  for h in "${hosts[@]}"; do
    end=$(cert_check "$h")
    case $? in
      1) problems+=("$h cert expires within ${WARN_DAYS}d") ;;
      2) problems+=("$h cert unreadable") ;;
    esac
    certs+=("$h: $end")
  done

  if ((${#problems[@]})); then
    failures=$((failures + 1))
    status="❌ $(join '; ' "${problems[@]}")"
  else
    status="✅"
  fi
  rows+=("| $url | ${code:-none} | $(join '<br>' "${certs[@]}") | $status |")
done

echo "| Site | HTTP | Certificate expires | Result |"
echo "|---|---|---|---|"
printf '%s\n' "${rows[@]}"
echo
if ((failures)); then
  echo "**$failures of ${#SITES[@]} sites failing.** Threshold: certificate valid > ${WARN_DAYS} days."
  exit 1
fi
echo "All ${#SITES[@]} sites OK."
