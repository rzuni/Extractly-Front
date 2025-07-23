import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IContentEntryYt } from '../../../interfaces';
import { ContentEntryYtService } from '../../../services/ContentEntryYtService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../modal/modal.component';
import { ContentEntryYtFormComponent } from '../content-entry-yt-form/content-entry-yt-form.component';

@Component({
  selector: 'app-content-entry-yt-list',
  standalone: true,
  imports: [CommonModule, ModalComponent, ContentEntryYtFormComponent],
  templateUrl: './content-entry-yt-list.component.html',
  styleUrls: ['./content-entry-yt-list.component.scss']
})
export class ContentEntryYtListComponent implements OnChanges {
  @Input() itemList: IContentEntryYt[] = [];
  @Input() areActionsAvailable: boolean = false;

  public selectedItem: IContentEntryYt = {};
  private entryService = inject(ContentEntryYtService);
  private modalService = inject(NgbModal);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['areActionsAvailable']) {
      console.log('Acciones disponibles:', this.areActionsAvailable);
    }
  }

  onFormEventCalled(updatedEntry: IContentEntryYt): void {
    this.entryService.update(updatedEntry);
    this.modalService.dismissAll();
  }

  deleteEntry(entry: IContentEntryYt): void {
    this.entryService.delete(entry);
  }

  openEditModal(entry: IContentEntryYt): void {
    const modalRef = this.modalService.open(ModalComponent, { size: 'lg' });
    modalRef.componentInstance.title = 'Editar Contenido';
    modalRef.componentInstance.bodyComponent = ContentEntryYtFormComponent;
    modalRef.componentInstance.bodyInput = entry;
    modalRef.componentInstance.onSubmit.subscribe((updatedEntry: IContentEntryYt) => {
      this.onFormEventCalled(updatedEntry);
    });
  }

  addEntry(newEntry: IContentEntryYt): void {
    this.itemList.push(newEntry);
  }
}
