declare module 'read-pkg-up' {
  const readPkgUp: {
    (): Promise<{ path: string, pkg: Object }>
  };
  export = readPkgUp;
}