# Design Document: Account Voucher Print Options

## Overview

This design implements a print functionality for the Account Voucher Creation page using a modal-based approach. The solution adds a reusable PrintModal component that presents print configuration options (format, paper size, orientation) and generates formatted print output using browser print APIs.

The implementation leverages React hooks for state management, CSS media queries for print styling, and the browser's native print dialog for the actual printing operation. The design prioritizes user experience with real-time preview updates and keyboard accessibility.

## Architecture

### Component Structure

```
AccountVoucherCreation (existing)
├── PrintModal (new)
│   ├── PrintOptionsPanel
│   │   ├── FormatSelector
│   │   ├── PaperSizeSelector
│   │   └── OrientationSelector
│   └── PrintPreview
└── PrintableVoucherDocument (new, hidden component for print rendering)
```

### Data Flow

1. User clicks Print button → Opens PrintModal with default options
2. User modifies print options → State updates trigger preview re-render
3. User clicks Print in modal → Generates print document with selected options
4. System invokes browser print dialog → User completes print operation
5. Print dialog closes → Modal closes automatically

### State Management

The PrintModal component manages local state for:
- `isOpen`: Boolean controlling modal visibility
- `printOptions`: Object containing format, paperSize, orientation
- `previewData`: Formatted voucher data for preview rendering

## Components and Interfaces

### PrintModal Component

**Props:**
```javascript
{
  isOpen: boolean,
  onClose: () => void,
  voucherData: Array<VoucherRecord>,
  onPrint: (options: PrintOptions) => void
}
```

**VoucherRecord Type:**
```javascript
{
  id: number,
  billNo: string,
  billDate: string,
  partyName: string,
  contract: string,
  gp: string,
  zone: string,
  dept: string,
  message: string,
  amount: number,
  status: string
}
```

**PrintOptions Type:**
```javascript
{
  format: 'detailed' | 'summary' | 'compact',
  paperSize: 'A4' | 'Letter' | 'Legal',
  orientation: 'portrait' | 'landscape'
}
```

### PrintOptionsPanel Component

**Props:**
```javascript
{
  options: PrintOptions,
  onChange: (options: PrintOptions) => void
}
```

**Responsibilities:**
- Render radio buttons or select controls for each option category
- Emit onChange events when user modifies selections
- Highlight currently selected options

### PrintPreview Component

**Props:**
```javascript
{
  voucherData: Array<VoucherRecord>,
  options: PrintOptions
}
```

**Responsibilities:**
- Render a scaled-down preview of the print output
- Apply formatting based on selected options
- Show pagination indicators for multi-page prints
- Update in real-time when options change

### PrintableVoucherDocument Component

**Props:**
```javascript
{
  voucherData: Array<VoucherRecord>,
  options: PrintOptions
}
```

**Responsibilities:**
- Render the actual print document (hidden from screen view)
- Apply print-specific CSS styles via media queries
- Format data according to selected print format
- Include headers, footers, and page numbers

## Data Models

### PrintOptions Model

```javascript
const defaultPrintOptions = {
  format: 'detailed',
  paperSize: 'A4',
  orientation: 'portrait'
};
```

**Format Options:**
- `detailed`: All fields displayed in full table format
- `summary`: Key fields only (Bill No, Date, Party, Amount, Status)
- `compact`: Minimal fields in condensed layout (Bill No, Party, Amount)

**Paper Size Dimensions:**
- `A4`: 210mm × 297mm
- `Letter`: 8.5in × 11in
- `Legal`: 8.5in × 14in

**Orientation:**
- `portrait`: Vertical layout
- `landscape`: Horizontal layout (90° rotation)

### Print Document Structure

```javascript
{
  header: {
    title: 'Account Vouchers',
    date: string, // Current date in format 'DD/MM/YYYY'
    filters: string // Applied date filter (e.g., 'Today', '7 Days')
  },
  body: {
    vouchers: Array<VoucherRecord>,
    format: string // Applied format type
  },
  footer: {
    pageNumber: number,
    totalPages: number,
    generatedBy: string // Optional user info
  }
}
```


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Modal Opens on Print Button Click

*For any* state of the application, when the Print button is clicked, the Print Modal should open and display print configuration options.

**Validates: Requirements 1.1**

### Property 2: Modal Closes on Escape or Outside Click

*For any* open Print Modal state, when the user presses Escape or clicks outside the modal, the modal should close without initiating a print operation.

**Validates: Requirements 1.4, 7.3**

### Property 3: Modal Prevents Underlying Interaction

*For any* open Print Modal state, elements outside the modal should not be focusable or receive click events.

**Validates: Requirements 1.5**

### Property 4: Option Selection Updates State

*For any* print option (format, paper size, or orientation), when a user selects that option, the print options state should reflect the selected value.

**Validates: Requirements 2.2, 3.2, 4.2**

### Property 5: Preview Updates on Option Change

*For any* change to print options (format, paper size, or orientation), the print preview should re-render to reflect the new configuration.

**Validates: Requirements 2.4, 3.4, 4.4, 6.2**

### Property 6: Print Execution with Selected Options

*For any* set of print options and voucher data, when the user clicks the Print button in the modal, the system should invoke the print function with those exact options and data.

**Validates: Requirements 5.1, 5.3**

### Property 7: Browser Print Dialog Invocation

*For any* print operation, the system should call the browser's native print API (window.print()).

**Validates: Requirements 5.2**

### Property 8: Modal Closes After Print

*For any* completed print operation, the Print Modal should close automatically.

**Validates: Requirements 5.4**

### Property 9: Preview Displays Voucher Data

*For any* non-empty voucher data set, the print preview should render all voucher records in the selected format.

**Validates: Requirements 6.1**

### Property 10: Preview Shows Pagination for Multiple Records

*For any* voucher data set with multiple records that exceeds one page, the print preview should display pagination indicators and page breaks.

**Validates: Requirements 6.3**

### Property 11: Preview Matches Print Output

*For any* voucher data and print options, the preview rendering should match the final print output formatting.

**Validates: Requirements 6.4**

### Property 12: Focus Trap Within Modal

*For any* open Print Modal, pressing Tab should cycle focus only through interactive elements within the modal, never escaping to the underlying page.

**Validates: Requirements 7.2**

### Property 13: Consistent Formatting Across Vouchers

*For any* set of multiple voucher records, each voucher should be formatted identically according to the selected print format.

**Validates: Requirements 8.4**

### Property 14: Print Document Structure

*For any* print operation, the generated document should include a header with title and date, and page numbers in the footer for multi-page prints.

**Validates: Requirements 8.5, 8.6**

## Error Handling

### Modal State Errors

**Error Condition:** Modal fails to open when Print button is clicked
- **Handling:** Log error to console, show user-friendly error message
- **Recovery:** Ensure modal state is reset, allow retry

**Error Condition:** Modal state becomes inconsistent (e.g., isOpen is true but modal doesn't render)
- **Handling:** Implement state validation in useEffect
- **Recovery:** Force state reset to default values

### Print Operation Errors

**Error Condition:** Browser print API is unavailable or blocked
- **Handling:** Detect window.print availability before invoking
- **Recovery:** Show error message: "Print functionality is not available in your browser"

**Error Condition:** Print operation is cancelled by user
- **Handling:** Gracefully close modal without error
- **Recovery:** Return to normal state, allow retry

**Error Condition:** Empty voucher data when print is attempted
- **Handling:** Disable Print button when voucherData.length === 0
- **Recovery:** Show message: "No vouchers available to print"

### Preview Rendering Errors

**Error Condition:** Preview fails to render due to invalid data
- **Handling:** Validate voucher data structure before rendering
- **Recovery:** Show error message in preview area, prevent print operation

**Error Condition:** Preview dimensions calculation fails
- **Handling:** Use fallback dimensions based on paper size
- **Recovery:** Log warning, continue with default dimensions

### Option Selection Errors

**Error Condition:** Invalid option value is selected
- **Handling:** Validate option values against allowed enums
- **Recovery:** Revert to previous valid option or default

## Testing Strategy

### Dual Testing Approach

This feature requires both unit testing and property-based testing for comprehensive coverage:

- **Unit tests** verify specific examples, edge cases, and error conditions
- **Property tests** verify universal properties across all inputs
- Together they provide comprehensive coverage: unit tests catch concrete bugs, property tests verify general correctness

### Unit Testing

Unit tests should focus on:

1. **Component Rendering**
   - PrintModal renders with correct initial state
   - All option selectors render with correct choices
   - Cancel button is present and functional
   - Preview area renders correctly

2. **Edge Cases**
   - Empty voucher data disables Print button (Requirement 5.5)
   - Modal with no vouchers shows appropriate message
   - Single voucher vs. multiple vouchers rendering
   - Very long party names or messages are truncated properly

3. **Integration Points**
   - Print button in AccountVoucherCreation triggers modal open
   - Modal receives correct voucher data from parent
   - Print callback is invoked with correct parameters

4. **Specific Format Examples**
   - Detailed format includes all fields (Requirement 8.1)
   - Summary format includes only key fields (Requirement 8.2)
   - Compact format includes minimal fields (Requirement 8.3)

5. **Initial State Examples**
   - Modal defaults to "Detailed" format (Requirement 2.3)
   - Modal defaults to "A4" paper size (Requirement 3.3)
   - Modal defaults to "Portrait" orientation (Requirement 4.3)
   - Focus moves to first interactive element on open (Requirement 7.1)

6. **UI Element Presence**
   - Format options (Detailed, Summary, Compact) are displayed (Requirement 2.1)
   - Paper size options (A4, Letter, Legal) are displayed (Requirement 3.1)
   - Orientation options (Portrait, Landscape) are displayed (Requirement 4.1)
   - Cancel button is visible (Requirement 7.4)

### Property-Based Testing

Property tests should be implemented using a property-based testing library appropriate for JavaScript/React (e.g., fast-check for JavaScript, or @testing-library/react with custom generators).

**Configuration:**
- Minimum 100 iterations per property test
- Each test must reference its design document property
- Tag format: **Feature: account-voucher-print-options, Property {number}: {property_text}**

**Property Test Coverage:**

1. **Property 1: Modal Opens on Print Button Click**
   - Generate: Random application states
   - Test: Clicking Print button always opens modal
   - Tag: Feature: account-voucher-print-options, Property 1: Modal Opens on Print Button Click

2. **Property 2: Modal Closes on Escape or Outside Click**
   - Generate: Random modal states
   - Test: Escape key or outside click always closes modal without printing
   - Tag: Feature: account-voucher-print-options, Property 2: Modal Closes on Escape or Outside Click

3. **Property 3: Modal Prevents Underlying Interaction**
   - Generate: Random modal states with various underlying elements
   - Test: Outside elements are never focusable when modal is open
   - Tag: Feature: account-voucher-print-options, Property 3: Modal Prevents Underlying Interaction

4. **Property 4: Option Selection Updates State**
   - Generate: Random option selections (format, paper size, orientation)
   - Test: Selected option always updates state correctly
   - Tag: Feature: account-voucher-print-options, Property 4: Option Selection Updates State

5. **Property 5: Preview Updates on Option Change**
   - Generate: Random option changes
   - Test: Preview always re-renders with new options
   - Tag: Feature: account-voucher-print-options, Property 5: Preview Updates on Option Change

6. **Property 6: Print Execution with Selected Options**
   - Generate: Random print options and voucher data
   - Test: Print function always receives correct options and data
   - Tag: Feature: account-voucher-print-options, Property 6: Print Execution with Selected Options

7. **Property 7: Browser Print Dialog Invocation**
   - Generate: Random print operations
   - Test: window.print() is always called
   - Tag: Feature: account-voucher-print-options, Property 7: Browser Print Dialog Invocation

8. **Property 8: Modal Closes After Print**
   - Generate: Random print operations
   - Test: Modal always closes after print completes
   - Tag: Feature: account-voucher-print-options, Property 8: Modal Closes After Print

9. **Property 9: Preview Displays Voucher Data**
   - Generate: Random non-empty voucher data sets
   - Test: Preview always renders all voucher records
   - Tag: Feature: account-voucher-print-options, Property 9: Preview Displays Voucher Data

10. **Property 10: Preview Shows Pagination for Multiple Records**
    - Generate: Random multi-page voucher data sets
    - Test: Pagination indicators always appear for multi-page data
    - Tag: Feature: account-voucher-print-options, Property 10: Preview Shows Pagination for Multiple Records

11. **Property 11: Preview Matches Print Output**
    - Generate: Random voucher data and print options
    - Test: Preview formatting always matches print formatting
    - Tag: Feature: account-voucher-print-options, Property 11: Preview Matches Print Output

12. **Property 12: Focus Trap Within Modal**
    - Generate: Random sequences of Tab key presses
    - Test: Focus always stays within modal boundaries
    - Tag: Feature: account-voucher-print-options, Property 12: Focus Trap Within Modal

13. **Property 13: Consistent Formatting Across Vouchers**
    - Generate: Random sets of multiple voucher records
    - Test: All vouchers always have identical formatting
    - Tag: Feature: account-voucher-print-options, Property 13: Consistent Formatting Across Vouchers

14. **Property 14: Print Document Structure**
    - Generate: Random print operations
    - Test: Document always includes header with title/date and footer with page numbers
    - Tag: Feature: account-voucher-print-options, Property 14: Print Document Structure

### Test Data Generators

For property-based testing, implement generators for:

- **VoucherRecord Generator:** Creates random voucher records with valid field values
- **PrintOptions Generator:** Creates random combinations of format, paper size, and orientation
- **Multi-page Data Generator:** Creates voucher data sets that span multiple pages
- **Edge Case Generator:** Creates boundary conditions (empty data, single record, maximum records)

### Testing Tools

- **Unit Testing:** Jest + React Testing Library
- **Property Testing:** fast-check (JavaScript property-based testing library)
- **Print Testing:** Mock window.print() and verify invocation
- **Accessibility Testing:** jest-axe for accessibility compliance
