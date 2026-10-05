# services/

This folder is reserved for the API/data layer (e.g. `projects.service.js`,
`analysis.service.js`, `auth.service.js`) once a backend exists.

This build is UI-only: every page currently reads static objects from
`src/utils/placeholderData.js` instead of calling a service. When a backend
is available, swap those imports for calls into this folder — component
code shouldn't need to change beyond the data-fetching hook.
