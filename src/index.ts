#!/usr/bin/env node

import { CLI } from './main/cli';

CLI().catch(console.error);