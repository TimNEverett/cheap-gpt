# ChatGPFree

## Overview

This is a simple chat gpt clone built with next.js, supabase and tailwindcss.

### Features

- supabase email auth
- separate chats
- streaming responses (very fast!)

## Get Started

### What you'll need

- supabase account
- vercel account
- open ai apikey
- a local copy of this repo to use to deploy the supabase backend.

### Supabase Backend

1. Start a new supabase project
2. Link project to your supabase remote
3. Deploy the repo against your remote supabase.
4. Deploy the chatgpt function
5. Turn off email confirmations in auth settings

### Nextjs Frontend

1. Deploy the nextjs frontend on vercel
2. Setup environment variables
3. Set url in supabase, set url to your nextjs app
4. Once deployed, sign up and get chatting!

NOTE: after you sign up, turn off signups in supabase settings, otherwise anyone with your site url could sign up to your site and chat on your dime.
