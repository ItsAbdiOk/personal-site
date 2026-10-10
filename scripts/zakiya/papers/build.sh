#!/bin/zsh
# Compile the Swift helpers (needs Xcode CLT swiftc). Output: ./bin/
cd "$(dirname "$0")"; mkdir -p bin
for t in pdflines pdfcrop; do
  if [[ ! -x bin/$t || $t.swift -nt bin/$t ]]; then swiftc -O $t.swift -o bin/$t 2>&1 | grep -v "CoreGraphics" ; fi
done
