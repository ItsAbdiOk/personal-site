#!/bin/zsh
# Re-run the whole deterministic pipeline (light CPU; ~20 s). Needs Xcode CLT swiftc for the PDFKit helpers.
cd "$(dirname "$0")"
./build.sh
P=/opt/homebrew/bin/python3.14
$P -I split_questions.py | tail -1
$P -I split_reports.py | head -1
$P -I tag_topics.py
$P -I link_pmt.py | head -2
$P -I build_bundles.py
