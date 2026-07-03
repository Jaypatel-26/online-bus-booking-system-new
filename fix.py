import glob

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        replacements = {
            'ðŸ“…': '📅',
            'ðŸ“‹': '📋',
            'ðŸ’º': '💺',
            'âš ': '⚠',
            'â€¦': '…'
        }
        
        new_content = content
        for bad, good in replacements.items():
            new_content = new_content.replace(bad, good)
            
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print('Fixed ' + filepath)
    except Exception as e:
        print(f"Error reading {filepath}: {e}")

for f in glob.glob('*.html') + glob.glob('*.js') + glob.glob('*.css'):
    fix_file(f)
print('Done!')
