---
title: "I Compared 20+ Resume Checkers, Then Built a Free One That Runs in Your Browser"
description: "Paid ATS resume checkers charge $17 to $50 a month. I spent half a day on 20+ of them, then built a free one: no backend, no account, no LLM, no hidden paywall. What it does, what it can't, and what you'd still pay for."
slug: "ats-resume-checker-in-the-browser"
publishedAt: "2026-10-15"
tags: ["resume", "ATS", "open source", "privacy", "AI"]
excerpt: "I needed one answer: what is my CV's ATS score? I spent half a day on 20+ tools, built a local one in an hour and a web version in a couple of evenings. Free, no sign-up, no backend, nothing leaves your browser."
published: true
---

# I Compared 20+ Resume Checkers, Then Built a Free One That Runs in Your Browser

I had one problem: I needed to know my CV's ATS score, quickly. So I did what
anyone would do and looked at what is on the market. I spent half a day going
through more than 20 tools.

Almost every one of them wanted something before it showed me a result: an
upload to a server, an email address, a sign-up, a trial that needs a card. The
paid ones cost between $17 and $50 a month. I looked at three of them closely.
One lets you scan five times a month for free, one gives you a limited version
of the same checks, and one expires its free plan after seven days.

I had a single problem and a single solution in mind, so I built it. The local
version, a script that scored a CV on my own machine, took about an hour. The
web service took a couple more evenings. It is [cv.shykov.dev](https://cv.shykov.dev):
free, no account, no backend, and everything runs in your browser.

A disclosure first: I'm looking for an engineering manager role, and
cv.shykov.dev is my project, so I'm not neutral. I'll say where it falls short.

## What you get, all at once

You drop a PDF or DOCX on the page and the whole result is on the screen
immediately. There is no "unlock the full report", no trial, no payment form, no
email gate.

- **An ATS score out of 100**, with the fixes that cost the most points listed
  first.
- **A humanization score.** It checks whether the CV reads like a person wrote
  it or like a template: filler phrases, the same opening word on every bullet,
  passive voice, claims without numbers. It is not an AI detector, and I'll
  explain why below.
- **A keyword match against a job posting.** Paste the posting and it shows which
  of the keywords it emphasizes your CV already contains and which are missing.
- **A CV builder** that gives you live feedback on the same ATS score as you
  type and exports an ATS-clean, single-column PDF with selectable text.

The interface is available in English, Spanish, Portuguese (Brazil and
Portugal), French and German.

## Why it's free

I understand why most tools in this space are not. A resume checker is a good
funnel: it collects an email address, it hands the user a number that feels
urgent, and a subscription fixes it. Others want the database for emailing
later. That is a business, and it is a fair one.

I wasn't building a business. I had one question and wanted the answer, and the
honest shape of the answer happens to be cheap. There is no server doing work
for each user and no model call per request, so there is no per-use cost to
recover. That is also why I can promise the rest: nothing is uploaded, because
there is nowhere to upload it to.

## What the paid tools charge

Prices I checked on the vendors' own pages on 9 October 2026:

| Tool | Free | Paid |
|---|---|---|
| [Jobscan](https://app.jobscan.co/plan) | 5 resume scans a month | $49.95 a month, or $29.98 a month billed as $89.95 every 3 months |
| [Rezi](https://www.rezi.ai/pricing) | 1 resume, limited ATS tools | $29 a month, or $149 once |
| [Enhancv](https://enhancv.com/pricing/) | 7 days, with branding | advertised "from $16.50"; its plan cards didn't render a readable price when I looked |

Review sites quote other numbers for the same tools, and most of them earn
affiliate fees, so check the vendor page before you pay.

## What an "ATS score" is

The number these tools sell is a 0 to 100 score. Nobody can show you how any of
them is computed, because none is published. And no applicant tracking system
publishes a score for a resume either.

Greenhouse, for one, states in its support documentation that its AI features
don't advance or reject candidates; recruiters and hiring managers make those
decisions. Employers can configure knockout questions that reject on a specific
answer, such as work authorization, but that's a form rule and not a resume
score. Some systems do add AI ranking on top, so I won't claim that none of them
scores anyone. Most of what you read about ATS rejection rates comes from
resume-service blogs with something to sell.

So what a checker can measure honestly is narrower: **can a machine read your
file?** Is the text extractable, are there sections it recognizes, is the
contact data where a parser expects it. That is a parseability check, and it is
a problem you can solve with a deterministic rule set.

## How it works

The score is a 100-point rubric of 15 checks:

| Category | Points |
|---|---|
| Parseability (machine-readable text, clean encoding) | 25 |
| Contact (email, phone, link) | 15 |
| Sections (experience, education, skills, summary, achievements) | 35 |
| Format (page count, dated history, bullets) | 15 |
| Content (quantified impact, action verbs) | 10 |

It parses your PDF or DOCX with `pdf.js` and `mammoth` in the browser tab, runs
the rules and lists the fixes. Three details I'd point a skeptical reader to:

- **The rubric is published, check by check.** A unit test fails if the table
  on the site drifts from the scoring code. You can read the rules, which you
  can't do with the paid tools.
- **You can verify there's no upload.** The page's content security policy only
  allows connections back to its own origin, and in the Network tab no request
  carries your file.
- **It's open source** under the MIT license, so you can read exactly what it
  does with your file.

## Why the humanization score is not an AI detector

I would be misleading you if I called it one. Detecting machine-written text
reliably needs a language model, and this tool has none. Published AI detectors
are also unreliable, and they misfire most on people whose first language is not
English, which is a large share of the people writing a CV in English.

So the score does something smaller and checkable: it names concrete habits and
points at the line that has them. A CV can score badly because a person wrote it
in a hurry, and that is still worth fixing. You decide what to change.

## What the LLM did, and what it didn't

An AI coding agent wrote most of the code. What I had to check by hand was
anything that behaves differently on a real device than in a test. The worst
bug of the project was Safari-only: Safari can't async-iterate a
`ReadableStream`, and `pdf.js` needs it, so PDF analysis failed on iPhones and
passed everywhere else until I added a polyfill. The scoring rules I checked
with tests, not by eye.

But there is no LLM in the product. The score comes from rules, so the same
file always gets the same number, and that is why I can publish the rubric and
test it.

The timeline is worth putting in perspective. A parseability check is a
well-bounded problem: extract text, find headings with regular expressions,
count things. That is why a local version took an hour. What takes longer is the
part around it: the PDF edge cases on iOS Safari, accessibility, the security
headers, the CI and the tests. The version I would put my name on took more
than the evenings.

## What you would still pay for

I would not say the paid tools are pointless. They do things mine doesn't:

- **Semantic matching.** My job-description match counts keywords. It doesn't
  understand that "led" and "managed" mean the same thing in context, and it
  doesn't rewrite your CV for a posting.
- **Rewriting and tailoring**, with an LLM behind them. That costs them money on
  every request, and it is a legitimate reason for a subscription.
- **Tracking and extras:** job trackers, LinkedIn optimization, templates,
  recruiter reviews. Rezi includes one expert review a month on Pro.

My score is also a heuristic. It tells you whether a parser will probably read
your CV, not whether an employer will like you. It can't tell you what a
specific company's system does.

## What I take from this

1. **Know what you're paying for.** For a parseability score you're paying for
   a number nobody can inspect. For tailoring and rewriting you're paying for
   LLM calls, which is a different thing.
2. **A free check is not free if you pay with your file or your inbox.** A CV
   carries a phone number and a full employment history. A local check removes
   that trade.
3. **Ask for the rubric.** A score without published rules is a claim, not a
   measurement.

## Try it, and tell me where it's wrong

[cv.shykov.dev](https://cv.shykov.dev) is free and open source. If the score
looks wrong on your CV, or you want to add a rule, the
[repository](https://github.com/mshykov/cv.shykov.dev) has a contributing guide
and a short list of issues that are good first tasks. Feedback and pull requests
are welcome.

## Frequently asked questions

### Is it really free?

Yes. There is no payment, no trial, no sign-up and no email gate, and the full
result is shown immediately. There is no backend that could hold a paywall.

### Does an ATS reject resumes automatically?

Not on resume content alone, according to the documentation of at least one
major system. Greenhouse says its AI features don't advance or reject
candidates. Employers can configure rules that reject on an answer to a form
question, so answer those accurately.

### How much do ATS resume checkers cost?

From about $17 to $50 a month in 2026, depending on the tool and the billing
period. Some have a free tier with a limit on scans or on features.

### Can I check my resume without uploading it?

Yes. A browser-based checker parses the file on your device. cv.shykov.dev does
this and has no backend that receives it; the content security policy blocks
connections to other origins.

### Does the humanization score detect AI-written CVs?

No. It checks writing habits such as filler phrases, repeated openers and
claims without numbers. It has no language model and doesn't try to tell who or
what wrote the text.

### Is a free ATS checker as good as a paid one?

For parseability, a rule-based checker covers the same ground. For tailoring
and rewriting, paid tools with an LLM do more. Which one you need depends on
whether your problem is "can it read my CV" or "what should my CV say".

## Sources

- [Jobscan plans](https://app.jobscan.co/plan), checked 9 October 2026
- [Rezi pricing](https://www.rezi.ai/pricing), checked 9 October 2026
- [Enhancv pricing](https://enhancv.com/pricing/), checked 9 October 2026
- Greenhouse, [MyGreenhouse FAQ for Candidates](https://support.greenhouse.io/hc/en-us/articles/43418495049499-MyGreenhouse-FAQ-for-Candidates)
- [cv.shykov.dev](https://cv.shykov.dev), [source code](https://github.com/mshykov/cv.shykov.dev)
