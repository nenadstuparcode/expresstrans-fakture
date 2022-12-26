import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'textPrice',
  pure: true,
})
export class TextPricePipe implements PipeTransform {

  public a: string[] = ['','jedan ','dva ','tri ','četiri ', 'pet ','šest ','sedam ','osam ','devet ','deset ','jedanaest ','dvanaest ','trinaest ','četrnaest ','petnaest ','šesnaest ','sedamnaest ','osamnaest ','devetnaest '];
  public b: string[] = ['', '', 'dvadeset','trideset','četrdeset','pedeset', 'šezdeset','sedamdeset','osamdeset','devedeset'];

  public inWords (num): string {
    if ((num = num.toString()).length > 9) return 'overflow';
    let n: any[] = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (this.a[Number(n[1])] || this.b[n[1][0]] + ' ' + this.a[n[1][1]]) + 'hiljade ' : '';
    str += (n[2] != 0) ? (this.a[Number(n[2])] || this.b[n[2][0]] + ' ' + this.a[n[2][1]]) + 'stotine ' : '';
    str += (n[3] != 0) ? (this.a[Number(n[3])] || this.b[n[3][0]] + ' ' + this.a[n[3][1]]) + 'hiljada ' : '';
    str += (n[4] != 0) ? (this.a[Number(n[4])] || this.b[n[4][0]] + ' ' + this.a[n[4][1]]) + 'stotina ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'i ' : '') + (this.a[Number(n[5])] || this.b[n[5][0]] + ' ' + this.a[n[5][1]]) + 'samo ' : '';
    return str;
  }

  transform(value: unknown, ...args: unknown[]): unknown {
    return this.inWords(value);
  }

}
