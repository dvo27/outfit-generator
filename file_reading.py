import os

pants_directory = 'C:/Users/raux2/.vscode/outfit generator/pants'
shirts_directory = 'C:/Users/raux2/.vscode/outfit generator/shirts'

pants_files = os.listdir(pants_directory)
shirts_files = os.listdir(shirts_directory)

print(pants_files)
print()
print(shirts_files)