import { optionalRequire } from "optional-require";

function tryRequire(packageName: string) {
  const pkg = optionalRequire(packageName);
  if (typeof pkg === "undefined") {
    // eslint-disable-next-line no-console
    console.error(`Dependency missed, please install '${packageName}' package`);
    process.exit(1);
  }
  return pkg;
}

export { tryRequire };
