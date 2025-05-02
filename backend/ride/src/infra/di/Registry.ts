export default class Registry {
  dependencies: { [name: string]: any };

  constructor() {
    this.dependencies = {};
  }

  provide(name: string, dependency: any) {
    this.dependencies[name] = dependency;
  }
  inject(name: string) {
    return this.dependencies[name];
  }
}
