# Mobile Iframe Fix - @math.gl/web-mercator Error Resolution

## 🐛 Problem Description

The application was experiencing `@math.gl/web-mercator: assertion failed` errors when switching between desktop and mobile viewports, particularly when using the map embed in iframes. This error occurred because:

1. **Invalid viewport dimensions**: During viewport transitions, `width` and `height` could be 0, negative, or transitional values
2. **Insufficient validation**: The `fitBounds` function was receiving invalid parameters
3. **Mobile viewport instability**: Rapid viewport changes caused calculation failures

## ✅ Solution Overview

### 1. Enhanced Viewport Dimension Validation (`usePlaces.ts`)

```typescript
// Before - Basic validation
if (!viewportWidth || !viewportHeight) return undefined

// After - Comprehensive validation
const minDimension = 50 // Minimum width/height for fitBounds to work properly
if (viewportWidth < minDimension || viewportHeight < minDimension) {
  return undefined
}
```

**Key improvements:**
- ✅ Minimum dimension validation (50px minimum)
- ✅ Coordinate validation with `isNaN()` and `isFinite()` checks
- ✅ Bounds validation for Infinity/-Infinity values
- ✅ Try-catch wrapper around `fitBounds()` calls
- ✅ Development-mode warning logs

### 2. Stable Viewport Detection (`useDetectScreen.ts`)

```typescript
// Enhanced dimension validation
const validateDimension = (dimension: number | undefined, fallback: number): number => {
  if (!dimension || !isFinite(dimension) || dimension < 1) {
    return fallback
  }
  return Math.max(dimension, 50) // Ensure minimum viable dimension
}
```

**Key improvements:**
- ✅ Transition state detection
- ✅ Stable fallback dimensions during transitions
- ✅ Debounced resize handling (500ms)
- ✅ Minimum dimension enforcement (50px)

### 3. Mobile-Optimized Embed Page (`embed.tsx`)

**Enhanced viewport meta tags:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="mobile-web-app-capable" content="yes" />
```

**Mobile-specific CSS:**
```css
/* iOS Safari fixes */
@supports (-webkit-touch-callout: none) {
  html, body {
    height: -webkit-fill-available;
  }
}

/* Enhanced touch handling */
.maplibregl-map {
  touch-action: pan-x pan-y;
  -webkit-user-select: none;
}
```

## 🧪 Testing & Verification

### Test Pages Created

1. **`/simple-iframe-test.html`** - Basic iframe functionality test
2. **`/mobile-iframe-test.html`** - Mobile-specific iframe test with device info
3. **`/viewport-switch-test.html`** - Comprehensive viewport switching test

### Viewport Switch Test Features

- 🔄 Desktop/Tablet/Mobile viewport simulation
- 🔥 Stress testing with rapid viewport switching
- 📊 Real-time error monitoring
- 🚨 @math.gl/web-mercator error detection
- 📝 Debug logging with timestamps

### Testing Results

✅ **Before Fix**: `@math.gl/web-mercator: assertion failed` errors during viewport changes  
✅ **After Fix**: No errors during viewport transitions  
✅ **Mobile Performance**: Smooth iframe rendering on mobile devices  
✅ **Stress Test**: Passes rapid viewport switching without errors  

## 🚀 Usage

### For Developers

1. **Test viewport switching**: Visit `/viewport-switch-test.html`
2. **Debug mobile issues**: Visit `/mobile-iframe-test.html`
3. **Check console logs**: Look for viewport warnings in development mode

### For Iframe Implementation

```html
<!-- Recommended iframe implementation -->
<iframe 
  src="/map/embed?lng=34.42&lat=31.46&z=9.00" 
  width="100%" 
  height="400" 
  frameborder="0" 
  style="border:0; min-height: 300px;" 
  allowfullscreen="" 
  allow="geolocation">
</iframe>
```

## 🔧 Technical Details

### Error Root Cause
The `@math.gl/web-mercator` library's `fitBounds` function has internal assertions that validate input parameters. When viewport dimensions are invalid (0, negative, or too small), these assertions fail with the error message.

### Fix Strategy
1. **Proactive validation**: Prevent invalid data from reaching `fitBounds`
2. **Graceful degradation**: Return `undefined` instead of crashing
3. **Stable dimensions**: Provide consistent viewport measurements
4. **Error boundaries**: Catch and handle calculation failures

### Browser Compatibility
- ✅ **iOS Safari**: Fixed with `-webkit-fill-available` and touch handling
- ✅ **Chrome Mobile**: Improved with enhanced viewport meta tags  
- ✅ **Firefox Mobile**: Stable with dimension validation
- ✅ **Desktop Browsers**: Backward compatible

## 📝 Notes

- The fix maintains backward compatibility with existing implementations
- Development mode provides helpful warning logs for debugging
- Minimum viewport dimension of 50px ensures map calculations work properly
- Touch interaction improvements enhance mobile user experience

## 🔍 Related Files Modified

- `src/lib/hooks/usePlaces.ts` - Enhanced bounds calculation validation
- `src/lib/hooks/useDetectScreen.ts` - Stable viewport dimension detection
- `src/pages/map/embed.tsx` - Mobile-optimized embed page
- `src/map/EmbedMapContainer.tsx` - Mobile-friendly container
- `src/lib/theme/globals.css` - Mobile iframe CSS fixes
- `src/pages/_document.tsx` - Removed conflicting viewport meta tag 