#!/usr/bin/env python3

"""
Author: Bart Grosman
Date: 14-10-2021


Description: 
Script to solve the "Error Correction in Reads" problem on rosalind. (http://rosalind.info/problems/corr/)
TODO

Usage: python3 read_correction.py path/to/dataset.fasta
"""
# Only import standard libraries
import sys


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

def rev_comp(dna: str):
    """ Generates the reverse complement of a uppercase DNA string.

    Keyword arguments:
    dna -- String of the DNA

    Returns:
    String of the respective reverse complement
    """
    dna_base_pairs = {
        'A': 'T',
        'T': 'A',
        'C': 'G',
        'G': 'C'
    }
    reverse_complement = [dna_base_pairs[base] for base in reversed(dna)]
    return ''.join(reverse_complement)

def split_correct_reads(sequences: list):
    """ Splits a list of sequences to find correct and incorrect reads

    Keyword arguments:
    sequences -- List of sequences with the form [(seq1, rev_comp_seq1), ...]

    Returns:
    Tuple like (correct_reads, incorrect_reads)
    """
    # Sort each sequence so the sequence and the
    # reverse complement are always in the same order
    reads = [sorted(sequence_pair) for sequence_pair in sequences]
    incorrect_reads = []
    correct_reads = []
    for read in reads:
        if read in correct_reads:
            # Do nothing, since it already was a correct read
            pass
        elif read not in incorrect_reads:
            # It's new so add it to incorrect reads
            incorrect_reads.append(read)
        else:
            # We already have in the incorrect reads, thus it must be a correct read
            incorrect_reads.remove(read)
            correct_reads.append(read)
    return (correct_reads, incorrect_reads)


def find_corrections(incorrect_reads: list, correct_reads: list):
    """ Finds the corrections to incorrect reads by searching the correct reads

    Keyword arguments:
    incorrect_reads -- List of incorrect reads with the form [(seq1, rev_comp_seq1), ...]
    correct_reads -- List of correct reads with the form [(seq1, rev_comp_seq1), ...]

    Returns:
    List of incorrect reads in a tuple with their correction, like:
    [('incorrxct', 'incorrect'), ...]
    """
    corrected_reads = []
    

if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit('Usage: python3 read_correction.py /path/to/file.fasta')
    # First parse the FASTA file, to extract the sequences
    fasta_content = open(sys.argv[1]).read()
    fasta_dict = parse_fasta(fasta_content)
    forward_sequences = fasta_dict.values() # Discard the headers for this exercise

    # Map them to add the reverse complement
    sequences = [(sequence, rev_comp(sequence)) for sequence in forward_sequences]
    # Split out the duplicates, and thus the correct reads
    correct_reads, incorrect_reads = split_correct_reads(sequences)
    # Now fix the incorrect reads
    print(incorrect_reads)