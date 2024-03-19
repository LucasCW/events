import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
    email = 'test@test.com';
    address = '28 Jason Place, North Rocks, 2151, Australia';

    onSubmit(form: NgForm) {
        console.log(form);
    }
}
