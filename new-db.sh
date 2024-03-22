#!/bin/bash

# Input and output file names
output_file="db.json"

rm $output_file



echo "{" >> $output_file
echo "\"wordhistory\":" >> $output_file
echo "[]," >> $output_file
echo "\"savedwords\":" >> $output_file
echo "[]" >> $output_file
echo "}" >> $output_file




echo "Processing complete. Output written to $output_file"
