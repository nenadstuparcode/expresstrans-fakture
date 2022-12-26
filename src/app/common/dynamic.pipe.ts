import { Injector, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dynamicPipe',
})
export class DynamicPipe implements PipeTransform {
  constructor(private injector: Injector) {}

  public transform(value: any, pipeToken: any, pipeArgs: any[] = []): any {
    if (!pipeToken) {
      return value;
    } else {
      const pipe: PipeTransform = this.injector.get(pipeToken);

      return pipe.transform(value, ...pipeArgs);
    }
  }
}
