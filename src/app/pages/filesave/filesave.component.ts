import { Component, OnInit } from '@angular/core';
import { FilesaveService } from '../../services/filesave.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileListComponent } from '../../components/filesave/filesave-list.component';  // <---

@Component({
  selector: 'app-filesave-page',
  standalone: true,
  imports: [CommonModule, FormsModule, FileListComponent],  // <---
  templateUrl: './filesave.component.html',
  styleUrls: ['./filesave.component.scss']  // corregido
})
export class FilesavePageComponent implements OnInit {
  files: any[] = [];
  newTitle = '';

  constructor(private filesaveService: FilesaveService) {}

  ngOnInit(): void {
    this.loadFiles();
  }

  loadFiles() {
    this.filesaveService.getAll().subscribe(data => {
      this.files = data;
    });
  }

  addFile() {
    if (!this.newTitle.trim()) return;
    this.filesaveService.create(this.newTitle).subscribe(() => {
      this.newTitle = '';
      this.loadFiles();
    });
  }
}
