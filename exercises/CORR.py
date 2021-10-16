#!/usr/bin/env python3

"""
Author: Bart Grosman
Date: 14-10-2021

Description: 
Script to solve the "Error Correction in Reads" problem on rosalind. (http://rosalind.info/problems/corr/)
This program finds incorrect reads in a FASTA file and tries to correct them,
with information of other reads.

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
    # Store the reads in the next lists, could also use dicts
    # for better performance but worse readability
    incorrect_reads = []
    correct_reads = []
    for read in sequences:
        reverse_read = tuple(sorted(read))
        if read in correct_reads or reverse_read in correct_reads:
            # Do nothing, since it already was a correct read
            pass
        elif read in incorrect_reads:
            # We already have in the incorrect reads, thus it must be a correct read
            incorrect_reads.remove(read)
            correct_reads.append(read)
        elif reverse_read in incorrect_reads:
            # We already have the reverse in incorrect reads, so remove it
            incorrect_reads.remove(reverse_read)
            correct_reads.append(read)     
        else:
            # It's new so add it to incorrect reads
            incorrect_reads.append(read)
    return (correct_reads, incorrect_reads)

def calc_hamm_dist(read_one: str, read_two: str):
    """ Calculates the hamming distance, i.e. the number of different bases,
    for 2 DNA sequences.
    Reads are assumed to be of equal length

    Keyword arguments:
    read_one -- First DNA sequence
    read_two -- Second DNA sequence, that is compared to the first one

    Returns:
    int, number of different bases
    """
    num_diff = 0
    for base_one, base_two in zip(read_one, read_two):
        if base_one != base_two:
            num_diff += 1
    return num_diff

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
    for read_forw, read_rev in incorrect_reads:
        # Find the correct read
        for correct_read_pair in correct_reads:
            for correct_read in correct_read_pair: # Check both forward and reverse
                if calc_hamm_dist(read_forw, correct_read) == 1:
                    # Found it, add a tuple to the stored list
                    corrected_reads.append((read_forw, correct_read))
    return corrected_reads

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
    # Now correct the incorrect reads
    corrections = find_corrections(incorrect_reads, correct_reads)
    # Last, print the corrections
    for original, correction in corrections:
        print("{}->{}".format(original, correction))
