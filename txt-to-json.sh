#!/bin/bash

# Input and output file names
input_file="every-word-in-the-dictionary.txt"
output_file="every-word-in-the-dictionary.json"

rm $output_file

# Add this text to each line
prefix="\""
affix="\","

echo "{ \"every-word-in-the-dictionary\": {" >> $output_file
echo "\"words\": [" >> $output_file

# Read each line from the input file and process it
while IFS= read -r line; do
  # Add the additional text to the line
  processed_line="${prefix}${line}${affix}"
  # Append the processed line to the output file
  echo "$processed_line" >> "$output_file"
done < "$input_file"


# remove the comma from the end of the last line
sed -i '$ s/.$//' $output_file

echo "]}}" >> "$output_file"

echo "Processing complete. Output written to $output_file"
