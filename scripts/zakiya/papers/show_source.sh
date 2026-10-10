#!/bin/zsh
# show_source.sh "<question id>" [--page] [--ms]     e.g.  show_source.sh "H556-01 June 2022 Q16"
#                                                          show_source.sh "H556-01 June 2022 Q16" --ms
#                                                          show_source.sh "<pdf path (absolute or relative to the source folder)>" <page>
# Writes a cropped JPEG (~1000px wide, q0.6) and prints its path.
DIR="$(cd "$(dirname "$0")" && pwd)"
"$DIR/build.sh" >/dev/null 2>&1
exec /opt/homebrew/bin/python3.14 -I "$DIR/show_source.py" "$@"
