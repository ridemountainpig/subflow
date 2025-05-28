# Service Icons Directory

This directory is used to store icons for different services in the application. When adding a new service, please follow the guidelines below.

## Icon Requirements

- **File Format**: Common image formats are supported (e.g., PNG, SVG).
- **Naming**: Name your icon file as `[service-name].[extension]` (e.g., `github.png`, `twitter.svg`)

## How to Add a New Service Icon

1. Prepare your icon following the requirements above
2. Place the icon file in this directory
3. Use the icon in your service configuration by referencing the path: `/services/[service-name].[extension]`

## How to Add a New Service

1. Add the service icon to the `public/services` directory
2. Generate a new UUID for the service and check if it is unique in the `data/subscriptionServices.ts` file
3. Add the service to the `data/subscriptionServices.ts` file

## Example

```js
// In your service configuration
{
  uuid: "4e7647ae-8d30-4b34-9029-6ea37d82417f",
  name: "GitHub",
  icon: "/services/github.svg"
}
```

If you have any questions about icon requirements or need assistance creating an icon, please open an issue in the repository.
