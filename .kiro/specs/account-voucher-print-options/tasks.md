# Implementation Plan: Account Voucher Print Options

## Overview

This implementation plan breaks down the print functionality feature into discrete coding tasks. The approach follows a bottom-up strategy: first building the core modal component and print options UI, then implementing the preview functionality, followed by the actual print execution logic, and finally integrating everything into the existing AccountVoucherCreation page.

## Tasks

- [ ] 1. Set up print modal component structure and styling
  - Create `src/components/PrintModal/PrintModal.jsx` component file
  - Implement modal overlay with backdrop and centered container
  - Add modal open/close state management with isOpen prop
  - Implement click-outside-to-close functionality
  - Implement Escape key handler to close modal
  - Add CSS for modal backdrop, container, and responsive sizing
  - _Requirements: 1.1, 1.4, 1.5_

- [ ]* 1.1 Write unit tests for modal open/close behavior
  - Test modal opens when isOpen is true
  - Test modal closes on Escape key press
  - Test modal closes on backdrop click
  - Test modal prevents interaction with underlying content
  - _Requirements: 1.1, 1.4, 1.5_

- [ ]* 1.2 Write property test for modal state management
  - **Property 1: Modal Opens on Print Button Click**
  - **Validates: Requirements 1.1**

- [ ]* 1.3 Write property test for modal close behavior
  - **Property 2: Modal Closes on Escape or Outside Click**
  - **Validates: Requirements 1.4, 7.3**

- [ ] 2. Implement print options panel with selectors
  - [ ] 2.1 Create PrintOptionsPanel component
    - Create `src/components/PrintModal/PrintOptionsPanel.jsx`
    - Implement format selector with radio buttons (Detailed, Summary, Compact)
    - Implement paper size selector with radio buttons (A4, Letter, Legal)
    - Implement orientation selector with radio buttons (Portrait, Landscape)
    - Add onChange handlers to update parent state
    - Style selectors with proper spacing and visual feedback
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 4.1, 4.2_

  - [ ] 2.2 Implement default print options state
    - Set default format to "detailed"
    - Set default paper size to "A4"
    - Set default orientation to "portrait"
    - _Requirements: 2.3, 3.3, 4.3_

  - [ ]* 2.3 Write unit tests for print options panel
    - Test all format options are displayed (Requirement 2.1)
    - Test all paper size options are displayed (Requirement 3.1)
    - Test all orientation options are displayed (Requirement 4.1)
    - Test default values are set correctly (Requirements 2.3, 3.3, 4.3)
    - Test onChange handlers are called with correct values
    - _Requirements: 2.1, 2.3, 3.1, 3.3, 4.1, 4.3_

  - [ ]* 2.4 Write property test for option selection
    - **Property 4: Option Selection Updates State**
    - **Validates: Requirements 2.2, 3.2, 4.2**

- [ ] 3. Checkpoint - Ensure modal and options panel work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Implement print preview component
  - [ ] 4.1 Create PrintPreview component
    - Create `src/components/PrintModal/PrintPreview.jsx`
    - Accept voucherData and options as props
    - Implement preview rendering based on selected format
    - Add scaling to fit preview area
    - Style preview to resemble print output
    - _Requirements: 6.1, 6.4_

  - [ ] 4.2 Implement format-specific rendering logic
    - Create helper function for "detailed" format (all fields)
    - Create helper function for "summary" format (key fields only)
    - Create helper function for "compact" format (minimal fields)
    - Apply format based on options.format prop
    - _Requirements: 8.1, 8.2, 8.3_

  - [ ] 4.3 Add pagination indicators for multi-page previews
    - Calculate number of pages based on voucher count and paper size
    - Display page break indicators in preview
    - Show "Page X of Y" indicator
    - _Requirements: 6.3_

  - [ ]* 4.4 Write unit tests for print preview
    - Test preview renders with voucher data
    - Test detailed format includes all fields (Requirement 8.1)
    - Test summary format includes only key fields (Requirement 8.2)
    - Test compact format includes minimal fields (Requirement 8.3)
    - Test pagination indicators appear for multi-page data
    - _Requirements: 6.1, 6.3, 8.1, 8.2, 8.3_

  - [ ]* 4.5 Write property test for preview updates
    - **Property 5: Preview Updates on Option Change**
    - **Validates: Requirements 2.4, 3.4, 4.4, 6.2**

  - [ ]* 4.6 Write property test for preview data display
    - **Property 9: Preview Displays Voucher Data**
    - **Validates: Requirements 6.1**

  - [ ]* 4.7 Write property test for preview pagination
    - **Property 10: Preview Shows Pagination for Multiple Records**
    - **Validates: Requirements 6.3**

- [ ] 5. Implement printable document component
  - [ ] 5.1 Create PrintableVoucherDocument component
    - Create `src/components/PrintModal/PrintableVoucherDocument.jsx`
    - Accept voucherData and options as props
    - Render document with header (title, date, filters)
    - Render voucher data in selected format
    - Render footer with page numbers
    - Apply print-specific CSS using @media print
    - Hide component from screen view (only visible when printing)
    - _Requirements: 5.3, 8.4, 8.5, 8.6_

  - [ ] 5.2 Implement print-specific CSS styles
    - Create `src/components/PrintModal/PrintStyles.css`
    - Add @media print rules for page size and orientation
    - Add styles for A4, Letter, and Legal paper sizes
    - Add styles for portrait and landscape orientations
    - Add page break rules for multi-page prints
    - Style header and footer for print output
    - _Requirements: 3.4, 4.4, 8.5, 8.6_

  - [ ]* 5.3 Write unit tests for printable document
    - Test document includes header with title and date (Requirement 8.5)
    - Test document includes footer with page numbers (Requirement 8.6)
    - Test document formats data according to selected format
    - _Requirements: 8.5, 8.6_

  - [ ]* 5.4 Write property test for document structure
    - **Property 14: Print Document Structure**
    - **Validates: Requirements 8.5, 8.6**

  - [ ]* 5.5 Write property test for consistent formatting
    - **Property 13: Consistent Formatting Across Vouchers**
    - **Validates: Requirements 8.4**

- [ ] 6. Implement print execution logic
  - [ ] 6.1 Add print handler function in PrintModal
    - Create handlePrint function that accepts print options
    - Validate voucher data is not empty before printing
    - Generate print document with selected options
    - Invoke window.print() to trigger browser print dialog
    - Close modal after print operation completes
    - _Requirements: 5.1, 5.2, 5.4_

  - [ ] 6.2 Add error handling for print operations
    - Check if window.print is available
    - Handle empty voucher data case
    - Handle print cancellation gracefully
    - Show error messages for failed print operations
    - _Requirements: 5.5_

  - [ ]* 6.3 Write unit tests for print execution
    - Test print handler is called with correct options
    - Test window.print() is invoked
    - Test modal closes after print
    - Test Print button is disabled when voucher data is empty (Requirement 5.5)
    - _Requirements: 5.1, 5.2, 5.4, 5.5_

  - [ ]* 6.4 Write property test for print execution
    - **Property 6: Print Execution with Selected Options**
    - **Validates: Requirements 5.1, 5.3**

  - [ ]* 6.5 Write property test for browser print invocation
    - **Property 7: Browser Print Dialog Invocation**
    - **Validates: Requirements 5.2**

  - [ ]* 6.6 Write property test for modal close after print
    - **Property 8: Modal Closes After Print**
    - **Validates: Requirements 5.4**

- [ ] 7. Checkpoint - Ensure print functionality works end-to-end
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement accessibility features
  - [ ] 8.1 Add focus management to PrintModal
    - Focus first interactive element when modal opens
    - Implement focus trap to keep focus within modal
    - Restore focus to Print button when modal closes
    - _Requirements: 7.1, 7.2_

  - [ ] 8.2 Add keyboard navigation support
    - Ensure Tab cycles through modal elements only
    - Ensure Shift+Tab works in reverse
    - Add aria-labels to all interactive elements
    - Add role="dialog" and aria-modal="true" to modal
    - _Requirements: 7.2, 7.5_

  - [ ] 8.3 Add Cancel button to modal
    - Create Cancel button in modal footer
    - Wire Cancel button to close modal without printing
    - Style Cancel button for visibility
    - _Requirements: 7.4_

  - [ ]* 8.4 Write unit tests for accessibility
    - Test focus moves to first element on open (Requirement 7.1)
    - Test Cancel button is visible (Requirement 7.4)
    - Test modal has correct ARIA attributes
    - _Requirements: 7.1, 7.4_

  - [ ]* 8.5 Write property test for focus trap
    - **Property 12: Focus Trap Within Modal**
    - **Validates: Requirements 7.2**

- [ ] 9. Integrate print modal into AccountVoucherCreation page
  - [ ] 9.1 Add print modal state to AccountVoucherCreation
    - Import PrintModal component
    - Add isPrintModalOpen state variable
    - Create handleOpenPrintModal function
    - Create handleClosePrintModal function
    - Pass voucher data to PrintModal
    - _Requirements: 1.1_

  - [ ] 9.2 Wire Print button to open modal
    - Update Print button onClick handler to call handleOpenPrintModal
    - Disable Print button when filteredVouchers is empty
    - _Requirements: 1.1, 5.5_

  - [ ] 9.3 Render PrintModal component
    - Add PrintModal component to AccountVoucherCreation JSX
    - Pass isOpen, onClose, voucherData, and onPrint props
    - Ensure modal renders conditionally based on isOpen state
    - _Requirements: 1.1_

  - [ ]* 9.4 Write integration tests
    - Test Print button opens modal
    - Test modal receives correct voucher data
    - Test print callback is invoked with correct parameters
    - Test Print button is disabled when no vouchers
    - _Requirements: 1.1, 5.5_

  - [ ]* 9.5 Write property test for modal interaction prevention
    - **Property 3: Modal Prevents Underlying Interaction**
    - **Validates: Requirements 1.5**

  - [ ]* 9.6 Write property test for preview-print output matching
    - **Property 11: Preview Matches Print Output**
    - **Validates: Requirements 6.4**

- [ ] 10. Final checkpoint - Ensure complete feature works correctly
  - Ensure all tests pass, ask the user if questions arise.
  - Verify print functionality works with different voucher data sets
  - Verify all print options produce correct output
  - Verify accessibility features work correctly

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties with minimum 100 iterations each
- Unit tests validate specific examples, edge cases, and error conditions
- The implementation uses React with functional components and hooks
- Print functionality leverages browser's native window.print() API
- CSS @media print queries handle print-specific styling
