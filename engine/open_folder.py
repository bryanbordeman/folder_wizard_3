import os
import sys
import os.path
import platform
import subprocess

def main():
    inputs = sys.argv[1] # input string
    open_folder(inputs)

def open_folder(path):
    '''opens new folder created by wizard'''
    if platform.system() == "Windows":
        os.startfile(path)
    elif platform.system() == "Darwin":
        subprocess.Popen(["open", path])
    else:
        subprocess.Popen(["xdg-open", path])

if __name__ == "__main__":
    main()