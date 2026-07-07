# Deployment Guide

## Local Development

Use Docker Compose to run the application stack locally.

## Production Notes

- Configure environment variables securely.
- Use managed PostgreSQL and Redis services where possible.
- Apply secrets through the deployment platform rather than storing them in source control.
- Enable logging, monitoring, and backups from the start.
