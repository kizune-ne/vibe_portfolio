import os
import json

KEYBOARDS_DIR = os.path.join(os.path.dirname(__file__), 'keyboards')
OUTPUT_JS = os.path.join(os.path.dirname(__file__), 'js', 'firmware-tree-data.js')

def build_tree(dir_path, rel_path=""):
    name = os.path.basename(dir_path) if rel_path else "keyboards"
    
    entries = os.listdir(dir_path)
    dir_nodes = []
    file_nodes = []
    
    for entry in entries:
        full_entry = os.path.join(dir_path, entry)
        entry_rel = os.path.join(rel_path, entry).replace("\\", "/") if rel_path else entry
        
        if os.path.isdir(full_entry):
            dir_nodes.append(build_tree(full_entry, entry_rel))
        else:
            try:
                with open(full_entry, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
            except Exception as e:
                content = f"// Error reading file: {e}"
            
            file_nodes.append({
                "name": entry,
                "type": "file",
                "path": "keyboards/" + entry_rel,
                "content": content
            })

    # Sort directories first, then files (standard IDE explorer sorting)
    dir_nodes.sort(key=lambda x: x["name"].lower())
    file_nodes.sort(key=lambda x: x["name"].lower())

    children = dir_nodes + file_nodes

    return {
        "name": name,
        "type": "folder",
        "path": "keyboards/" + rel_path if rel_path else "keyboards",
        "children": children
    }

tree = build_tree(KEYBOARDS_DIR)
js_content = f"// Auto-generated explicit firmware tree data (Folders first)\nexport const REAL_FIRMWARE_TREE = {json.dumps(tree, indent=2)};\n"

with open(OUTPUT_JS, 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Generated explicit folder tree (folders first) successfully!")
