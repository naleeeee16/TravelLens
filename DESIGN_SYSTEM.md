# 🎨 TravelLens - Visual Design Guide

## Color Palette

### **Primary Colors**
```
Blue Primary:        #3b82f6  RGB(59, 130, 246)   ← Main brand color
Blue Dark:           #1e40af  RGB(30, 64, 175)    ← Darker shade on hover
Purple Secondary:    #8b5cf6  RGB(139, 92, 246)   ← Accent color
```

### **Semantic Colors**
```
Success (Green):     #10b981  RGB(16, 185, 129)   ← Match badges, positive actions
Danger (Red):        #ef4444  RGB(239, 68, 68)    ← Delete, remove, errors
Warning (Amber):     #f59e0b  RGB(245, 158, 11)   ← Alerts, caution
```

### **Neutral Colors**
```
White (Card BG):     #ffffff  RGB(255, 255, 255)
Light Gray (BG):     #f8fafc  RGB(248, 250, 252)
Border Gray:         #e2e8f0  RGB(226, 232, 240)
Text Dark:           #1e293b  RGB(30, 41, 59)     ← Headings, main text
Text Light:          #64748b  RGB(100, 116, 139)  ← Secondary text
```

## Typography

### **Font Stack**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

Uses the system's native font for optimal performance and familiarity.

### **Font Sizes & Weights**

#### **Headings**
```
H1 (Main Title):     3rem      (48px)    Font Weight 800
H2 (Section Title):  2rem      (32px)    Font Weight 700
H3 (Card Title):     1.4rem    (22px)    Font Weight 700
H4 (Subsection):     1.1rem    (18px)    Font Weight 600
```

#### **Body Text**
```
Large:               1.1rem    (18px)    Font Weight 500
Normal:              1rem      (16px)    Font Weight 400
Small:               0.95rem   (15px)    Font Weight 400
Tiny:                0.85rem   (14px)    Font Weight 500
```

## Spacing System

Based on 0.5rem (8px) units:

```
xs:  0.5rem   (4px)
sm:  0.75rem  (6px)
md:  1rem     (8px)
lg:  1.5rem   (12px)
xl:  2rem     (16px)
xxl: 3rem     (24px)
```

### **Common Spacing**
```css
Padding (Cards):      1.5rem to 2rem
Gap (Grid):           1rem to 2rem
Margin (Sections):    2rem to 3rem
Border Radius:        8px to 12px
```

## Animation & Transitions

### **Standard Transition**
```css
transition: all 0.3s ease;
```

### **Hover Effects**
```css
/* Card Hover */
transform: translateY(-8px);
box-shadow: 0 12px 24px rgba(59, 130, 246, 0.15);

/* Button Hover */
transform: translateY(-2px);
box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);

/* Icon Hover */
transform: scale(1.15);
```

### **Active/Focus States**
```css
border-color: var(--primary);
box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
```

### **Loading Animation**
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
animation: spin 0.8s linear infinite;
```

## Component Styling

### **Buttons**

#### **Primary Button**
```css
background: #3b82f6
color: white
padding: 0.75rem 1.5rem
border-radius: 8px
font-weight: 500
box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2)

Hover: background: #1e40af, transform: translateY(-2px)
```

#### **Secondary Button**
```css
background: #8b5cf6
color: white
padding: 0.75rem 1.5rem
border-radius: 8px

Hover: background: #7c3aed, transform: translateY(-2px)
```

#### **Outline Button**
```css
background: transparent
color: #3b82f6
border: 2px solid #3b82f6
padding: 0.6rem 1.2rem

Hover: background: #3b82f6, color: white
```

### **Cards**

#### **Destination Card**
```css
background: white
border-radius: 12px
padding: 1.5rem
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08)
border: 2px solid transparent

Hover:
  border-color: #3b82f6
  transform: translateY(-8px)
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.15)
```

#### **Theme Card (Gradient)**
```css
background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)
color: white
padding: 1rem 1.5rem
border-radius: 12px
```

### **Form Inputs**

```css
border: 2px solid #e2e8f0
border-radius: 8px
padding: 0.75rem 1rem
transition: all 0.3s ease

Focus:
  outline: none
  border-color: #3b82f6
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1)
```

### **Tags**

```css
background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)
color: #3b82f6
padding: 0.6rem 1.2rem
border-radius: 20px
border: 1px solid rgba(59, 130, 246, 0.2)
font-weight: 600
font-size: 0.9rem
```

## Responsive Breakpoints

### **Media Queries**
```css
/* Desktop First */
@media (max-width: 1024px) {
  /* Tablet adjustments */
}

@media (max-width: 768px) {
  /* Mobile adjustments */
}
```

### **Desktop (1024px+)**
- 2-column layouts
- Full-width sections
- Large padding: 2-3rem
- Grid spacing: 1.5-2rem

### **Tablet (768px - 1024px)**
- Adjusted spacing
- Flexible grid columns
- Medium padding: 1.5rem
- Reduced font sizes

### **Mobile (< 768px)**
- Single column
- Stacked layouts
- Minimal padding: 1rem
- Touch-friendly sizes (44x44px minimum)
- Full-width buttons

## Shadow System

### **Light Shadow** (Cards, subtle)
```css
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
```

### **Medium Shadow** (Cards on hover)
```css
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
```

### **Heavy Shadow** (Modals, important elements)
```css
box-shadow: 0 12px 24px rgba(59, 130, 246, 0.15);
```

### **Colored Shadow** (Buttons)
```css
box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
```

## Gradients

### **Primary Gradient**
```css
background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
```
Used for headers, hero sections, CTAs.

### **Success Gradient**
```css
background: linear-gradient(135deg, #10b981 0%, #059669 100%);
```
Used for match badges, positive indicators.

### **Light Gradient**
```css
background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
```
Used for light backgrounds, tags, info boxes.

## Icon Design

Uses native emoji for:
- 📸 Image upload
- 📌 Pinterest
- ✈️ Flights
- 💖 Wishlist
- 🎯 Match/Target
- ✨ Highlights
- 🎨 Vibe/Design
- 🏷️ Tags
- ⭐ Rating
- 🌍 Destination
- 🚀 Action/Launch

## Layout Grid

### **Container Max Width**
```css
max-width: 1400px;
margin: 0 auto;
padding: 0 2rem;
```

### **Grid Layouts**
```css
/* Auto-fill cards */
grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));

/* Two column */
grid-template-columns: 2fr 1fr;

/* Auto-fit tags */
grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
```

## Accessibility

### **Color Contrast**
- Text on white: #1e293b (AAA rating)
- White on blue: #3b82f6 (AAA rating)
- Text on light gray: #64748b (AA rating)

### **Focus States**
All interactive elements have visible focus states with border and shadow.

### **Touch Targets**
Minimum 44x44px for mobile buttons.

### **Semantic HTML**
- Proper heading hierarchy (H1 → H4)
- Form labels and inputs
- Button elements for actions
- Alt text for images

## Dark Mode (Future Enhancement)

Prepared CSS variables for easy dark mode implementation:
```css
:root {
  --bg-light: #f8fafc;      /* Light → #1e293b */
  --bg-card: #ffffff;        /* White → #0f172a */
  --text-primary: #1e293b;   /* Dark → #f1f5f9 */
}
```

---

**Design System Complete! 🎨**

This comprehensive visual guide ensures consistency across the entire application and makes future updates and maintenance straightforward.
