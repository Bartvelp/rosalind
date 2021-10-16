#!/usr/bin/env python3

"""
Author: Bart Grosman
Date: 16-10-2021

Description: 
Script to solve the "Maximum Matchings and RNA Secondary Structures" problem on rosalind. (http://rosalind.info/problems/corr/)
This is a combinatorial problem. Since "knots" in the graph are allowed, one can observe that
the number of A-U bonds and C-G bonds are independant on eachother. This can be exploited to
generate a very fast algorithm.

Usage: python3 maxiumum_matching.py path/to/dataset.fasta
"""
# Only import standard libraries
import sys
import math


def parse_fasta(fasta_file_contents: str):
    """ Parses a given fasta file, to extract sequences and their headers

    Keyword arguments:
    fasta_file_contents -- String of the content of a FASTA file

    Returns:
    Dictionary with headers as keys, and sequences as values
    """
    fasta_dict = {}
    header = '' # Init header in function scope
    lines = fasta_file_contents.split('\n')
    for line in lines:
        if line.startswith('>'):
            header = line[1:]
            if header not in fasta_dict:
                fasta_dict[header] = ''
        else:
            # It's a sequence
            fasta_dict[header] += line.strip()
    return fasta_dict


def calc_num_options(more: int, less: int):
    """ Calculate the number of possible options to get the maximal number of
    basepair matches. more should be bigger or equal to less.

    Keyword arguments:
    more -- Count of the nucleotide which occurs more often than it's matching base
    less -- Count of the matching nucleotide

    Returns:
    int, number of possible maximum matchings
    """
    diff = more - less
    num_options = 1
    for num in range(diff + 1, more + 1):
        num_options *= num
    return num_options

if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit('Usage: python3 maxiumum_matching.py /path/to/file.fasta')
    # First parse the FASTA file, to extract the sequences
    fasta_content = open(sys.argv[1]).read()
    fasta_dict = parse_fasta(fasta_content)
    sequences = fasta_dict.values() # Discard the headers for this exercise
    first_sequence = list(sequences)[0]

    # Number of options is given by the formula:
    # more! / (more - less)!
    # with more being the base with the higher count than the matching one.
    #
    # But this shouldn't be calculated this way, since dividing will give
    # a float, and that is too inaccurate for large numbers.
    # Therefore the above equation is in implemented in calc_num_options
    # in a simpler way.

    # Find the number of counts for A and U
    AU_counts = sorted([first_sequence.count('A'), first_sequence.count('U')])
    num_AU_options = calc_num_options(AU_counts[1], AU_counts[0])
    # Same for GC
    GC_counts = sorted([first_sequence.count('G'), first_sequence.count('C')])
    num_GC_options = calc_num_options(GC_counts[1], GC_counts[0])
    # Now multiply them to get the total number of options
    total_num_options = num_AU_options * num_GC_options
    print(total_num_options)
