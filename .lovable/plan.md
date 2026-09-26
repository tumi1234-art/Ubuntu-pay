# Fix blocked registration

## Changes
- Replace the registration checks with one schema that reads the submitted form fields by their exact names.
- Show field-specific validation messages and preserve the backend's real error instead of relabelling it as a password-length issue.
- Prevent duplicate submissions while account creation is in progress.

## Verification
- Test a password longer than eight characters through the rendered registration form.
- Confirm the request reaches account creation and the obsolete combined error cannot appear.
- Check the latest preview diagnostics, then publish the corrected version live.
