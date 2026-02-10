/* eslint-disable prefer-destructuring */
/* eslint-disable one-var */
import { Typography, Box, Stack } from '@mui/material';

const isObject = (val) => val !== null && typeof val === 'object' && !Array.isArray(val);

// Fields yang perlu di-skip di semua level
const SKIP_FIELDS = ['updatedAt', 'createdAt', '_id', '__v', 'id'];

// Format value untuk display
const formatValue = (value) => {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return value.toLocaleString();
  if (Array.isArray(value)) return `[${value.length} items]`;
  if (isObject(value)) {
    const keys = Object.keys(value);
    if (keys.length <= 3) {
      return keys.map((k) => `${k}: ${formatValue(value[k])}`).join(', ');
    }
    return '{...}';
  }
  return String(value);
};

// Format field label
const formatLabel = (key) => {
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

// Detect apakah object memiliki struktur {before: ..., after: ...}
const hasBeforeAfterStructure = (obj) => {
  if (!isObject(obj)) return false;
  const keys = Object.keys(obj);
  return keys.includes('before') && keys.includes('after') && keys.length === 2;
};

// Recursive function untuk render changes
const renderChangeRecursive = (data, path = '', level = 0) => {
  if (!isObject(data)) return [];

  const results = [];

  Object.keys(data).forEach((key) => {
    if (SKIP_FIELDS.includes(key)) return;

    const value = data[key];
    const currentPath = path ? `${path}.${key}` : key;

    // Case 1: Current key has {before, after} structure
    if (hasBeforeAfterStructure(value)) {
      const { before: beforeVal, after: afterVal } = value;

      // Sub-case: Both are objects - nested change
      if (isObject(beforeVal) && isObject(afterVal)) {
        const changedSubKeys = Object.keys(afterVal).filter(
          (subKey) =>
            !SKIP_FIELDS.includes(subKey) && JSON.stringify(beforeVal[subKey]) !== JSON.stringify(afterVal[subKey])
        );

        if (changedSubKeys.length > 0) {
          results.push(
            <Box key={currentPath} sx={{ mb: 1, ml: level * 2 }}>
              <Typography variant="subtitle2" sx={{ textTransform: 'capitalize', fontSize: '0.75rem' }}>
                {formatLabel(key)}
              </Typography>
              <Stack spacing={0.5} pl={2}>
                {changedSubKeys.map((subKey) => (
                  <Typography key={subKey} variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {formatLabel(subKey)}:
                    <Box component="span" sx={{ mx: 0.5, color: 'error.main' }}>
                      {formatValue(beforeVal[subKey])}
                    </Box>
                    {' → '}
                    <Box component="span" sx={{ fontWeight: 600, mx: 0.5, color: 'success.main' }}>
                      {formatValue(afterVal[subKey])}
                    </Box>
                  </Typography>
                ))}
              </Stack>
            </Box>
          );
        }
      }
      // Sub-case: Simple value change
      else if (JSON.stringify(beforeVal) !== JSON.stringify(afterVal)) {
        results.push(
          <Typography
            key={currentPath}
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: '0.7rem', display: 'block', ml: level * 2, mb: 0.5 }}
          >
            <strong>{formatLabel(key)}</strong>:
            <Box component="span" sx={{ mx: 0.5, color: 'error.main' }}>
              {formatValue(beforeVal)}
            </Box>
            {' → '}
            <Box component="span" sx={{ fontWeight: 600, mx: 0.5, color: 'success.main' }}>
              {formatValue(afterVal)}
            </Box>
          </Typography>
        );
      }
    }
    // Case 2: Current value is object but NOT {before, after} - go deeper
    else if (isObject(value) && level < 3) {
      const nestedResults = renderChangeRecursive(value, currentPath, level + 1);
      if (nestedResults && nestedResults.length > 0) {
        results.push(
          <Box key={currentPath} sx={{ mb: 1, ml: level * 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ textTransform: 'capitalize', fontSize: '0.75rem', color: 'primary.main' }}
            >
              {formatLabel(key)}
            </Typography>
            <Box sx={{ pl: 1 }}>{nestedResults}</Box>
          </Box>
        );
      }
    }
  });

  return results;
};

const renderChanges = (beforeOrChangesData, afterData = null) => {
  // Support 2 cara pemanggilan:
  // 1. renderChanges(changesObject) - changesObject memiliki property {before, after}
  // 2. renderChanges(before, after) - 2 parameter terpisah

  let before, after;

  // Jika parameter pertama punya property 'before' dan 'after', gunakan itu
  if (isObject(beforeOrChangesData) && 'before' in beforeOrChangesData && 'after' in beforeOrChangesData) {
    before = beforeOrChangesData.before;
    after = beforeOrChangesData.after;
  }
  // Jika tidak, anggap parameter pertama = before, parameter kedua = after
  else {
    before = beforeOrChangesData;
    after = afterData;
  }

  // Validasi data
  if (before === null && after === null) {
    console.log('Both before and after are null');
    return null;
  }

  console.log('renderChanges called with:', { before, after });

  const results = [];

  // Case 1: CREATE - before is null, after contains all data
  if ((before === null || before === undefined) && isObject(after)) {
    console.log('Case 1: CREATE scenario');

    Object.keys(after).forEach((key) => {
      if (SKIP_FIELDS.includes(key)) return;

      const value = after[key];

      // Nested object
      if (isObject(value)) {
        const hasContent = Object.keys(value).some((k) => !SKIP_FIELDS.includes(k));
        if (!hasContent) return;

        results.push(
          <Box key={key} sx={{ mb: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{ textTransform: 'capitalize', color: 'success.main', fontSize: '0.75rem' }}
            >
              ✓ {formatLabel(key)}
            </Typography>
            <Stack spacing={0.5} pl={2}>
              {Object.keys(value)
                .filter((subKey) => !SKIP_FIELDS.includes(subKey))
                .map((subKey) => (
                  <Typography key={subKey} variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {formatLabel(subKey)}:
                    <Box component="span" sx={{ fontWeight: 600, mx: 0.5, color: 'success.main' }}>
                      {formatValue(value[subKey])}
                    </Box>
                  </Typography>
                ))}
            </Stack>
          </Box>
        );
      }
      // Simple value
      else {
        results.push(
          <Typography
            key={key}
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5 }}
          >
            <strong>{formatLabel(key)}</strong>:
            <Box component="span" sx={{ fontWeight: 600, mx: 0.5, color: 'success.main' }}>
              {formatValue(value)}
            </Box>
          </Typography>
        );
      }
    });

    console.log('CREATE results:', results.length);
    return results;
  }

  // Case 2: UPDATE - before contains changed fields with {before, after} structure
  if (isObject(before) && (after === null || after === undefined)) {
    console.log('Case 2: UPDATE with nested before/after structure');
    const recursiveResults = renderChangeRecursive(before);
    console.log('Recursive results:', recursiveResults.length);
    return recursiveResults;
  }

  // Case 3: Standard UPDATE - both before and after are full objects
  if (isObject(before) && isObject(after)) {
    console.log('Case 3: Standard UPDATE');

    Object.keys(after).forEach((key) => {
      if (SKIP_FIELDS.includes(key)) return;

      const beforeValue = before[key];
      const afterValue = after[key];

      // No change
      if (JSON.stringify(beforeValue) === JSON.stringify(afterValue)) return;

      // Nested object
      if (isObject(beforeValue) && isObject(afterValue)) {
        const changedKeys = Object.keys(afterValue).filter(
          (subKey) =>
            !SKIP_FIELDS.includes(subKey) && JSON.stringify(beforeValue[subKey]) !== JSON.stringify(afterValue[subKey])
        );

        if (changedKeys.length > 0) {
          results.push(
            <Box key={key} sx={{ mb: 1 }}>
              <Typography variant="subtitle2" sx={{ textTransform: 'capitalize', fontSize: '0.75rem' }}>
                {formatLabel(key)}
              </Typography>
              <Stack spacing={0.5} pl={2}>
                {changedKeys.map((subKey) => (
                  <Typography key={subKey} variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {formatLabel(subKey)}:
                    <Box component="span" sx={{ mx: 0.5, color: 'error.main' }}>
                      {formatValue(beforeValue[subKey])}
                    </Box>
                    {' → '}
                    <Box component="span" sx={{ fontWeight: 600, mx: 0.5, color: 'success.main' }}>
                      {formatValue(afterValue[subKey])}
                    </Box>
                  </Typography>
                ))}
              </Stack>
            </Box>
          );
        }
      }
      // New nested object
      else if (isObject(afterValue) && !beforeValue) {
        results.push(
          <Box key={key} sx={{ mb: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{ textTransform: 'capitalize', color: 'success.main', fontSize: '0.75rem' }}
            >
              ✓ {formatLabel(key)} (New)
            </Typography>
            <Stack spacing={0.5} pl={2}>
              {Object.keys(afterValue)
                .filter((subKey) => !SKIP_FIELDS.includes(subKey))
                .map((subKey) => (
                  <Typography key={subKey} variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {formatLabel(subKey)}:
                    <Box component="span" sx={{ fontWeight: 600, mx: 0.5, color: 'success.main' }}>
                      {formatValue(afterValue[subKey])}
                    </Box>
                  </Typography>
                ))}
            </Stack>
          </Box>
        );
      }
      // Simple value
      else {
        results.push(
          <Typography
            key={key}
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5 }}
          >
            <strong>{formatLabel(key)}</strong>:
            <Box component="span" sx={{ mx: 0.5, color: 'error.main' }}>
              {formatValue(beforeValue)}
            </Box>
            {' → '}
            <Box component="span" sx={{ fontWeight: 600, mx: 0.5, color: 'success.main' }}>
              {formatValue(afterValue)}
            </Box>
          </Typography>
        );
      }
    });

    console.log('Standard UPDATE results:', results.length);
    return results;
  }

  console.log('No matching case, returning null');
  return null;
};

export default renderChanges;
