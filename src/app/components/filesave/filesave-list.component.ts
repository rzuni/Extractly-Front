import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filesave-list.component.html',
  styleUrls: ['./filesave-list.component.scss']
})
export class FileListComponent {
  @Input() files: any[] = [];
}
