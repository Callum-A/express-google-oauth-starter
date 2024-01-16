# Express Google OAuth Starter

## Introduction

This project is a skeleton REST API which supports Google OAuth for its users. It registers and handles login for users.
It then comes with some basic routes for example `/api/v1/users/protected` which is an example of a route requiring authentication.
Currently the middleware works by any URL path containing `/protected` will require a valid JWT. There are also some basic open
routes for example getting users to act as an example of how to write routes.

I tried to write this as basic as possible so people can fork and replace the components as they need but have an authentication
solution out of the box for their APIs.

## Getting Started

```bash
git clone https://github.com/Callum-A/express-google-oauth-starter.git <project-name>
cd <project-name>
npm install
# Ensure to populate .env
cp .env.example .env
```
