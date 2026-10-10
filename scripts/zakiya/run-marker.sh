#!/bin/zsh
# Run Marker (local OCR with LaTeX equations) on a PDF on the Apple GPU, then stop its helper servers.
# Usage: scripts/zakiya/run-marker.sh <input.pdf> <output_dir>
set -u
R=${0:A:h:h:h}
export MODEL_CACHE_DIR=$R/data/models HF_HOME=$R/data/models/hf TORCH_DEVICE=mps
cleanup() {
  pkill -f "surya\.(fast_layout|ocr_error)\.server" 2>/dev/null
  pkill -f "llama-server.*surya" 2>/dev/null
  pkill -x llama-server 2>/dev/null
}
trap cleanup EXIT INT TERM
~/.venvs/marker/bin/marker_single "$1" --output_dir "$2" --force_ocr
