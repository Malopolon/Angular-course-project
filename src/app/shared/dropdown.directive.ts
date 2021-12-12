import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  @HostBinding('class.active') isOpen = false;

  @HostListener('click') toggleOpen() {
    this.isOpen = !this.isOpen;
  }
}
