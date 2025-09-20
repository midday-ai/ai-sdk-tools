---
"@ai-sdk-tools/artifacts": patch
---

Add include/exclude filtering to useArtifacts hook

- Add `include?: string[]` option to only listen to specified artifact types
- Add `exclude?: string[]` option to ignore specified artifact types  
- Implement proper filtering logic that handles both include and exclude options
- Maintain backward compatibility with existing useArtifacts usage
- Perfect for building focused artifact UIs that only care about specific types
