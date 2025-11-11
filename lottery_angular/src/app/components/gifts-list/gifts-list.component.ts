import { inject, ChangeDetectorRef, Component, OnInit, ViewChild, Input, input } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Gift } from '../../models/gift.model';
import { TableModule } from 'primeng/table';
import { Dialog, DialogModule } from 'primeng/dialog';
import { Ripple } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select';
import { Tag, TagModule } from 'primeng/tag';
import { RadioButton } from 'primeng/radiobutton';
import { Rating, RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputNumber, InputNumberModule } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { GiftsService } from '../../services/gifts.service';
import { Observable } from 'rxjs';
import { DonorsService } from '../../services/donors.service';
import { Donor } from '../../models/Donor.model';
import { ChooseGiftsComponent } from "../choose-gifts/choose-gifts.component";


interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-gifts-list',
    standalone: true,
    providers: [MessageService, ConfirmationService],
    imports: [InputNumberModule, InputTextModule, RatingModule, SelectModule, IconFieldModule, InputIconModule, TagModule, ToastModule, ButtonModule, CommonModule, TableModule, RatingModule, FormsModule, DialogModule, ConfirmDialogModule, FileUploadModule, DropdownModule, CommonModule, ToolbarModule],
    templateUrl: './gifts-list.component.html',
    styleUrl: './gifts-list.component.css',
    styles: [
        `:host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
    }`
    ]
})
export class GiftsListComponent {
    ngOnInit() {
        this.loadDemoData()
    }
    productDialog: boolean = false;
    message: string = ""
    giftsService: GiftsService = inject(GiftsService);
    donorsService: DonorsService = inject(DonorsService);

    gifts: Gift[] = [];
    donors: Donor[] = [];
    donorsNames!: string[];
    gift!: Gift;

    // selectedGifts!: Gift[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    cols!: Column[];

    exportColumns!: ExportColumn[];

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private cd: ChangeDetectorRef
    ) { }


    exportCSV() {
        this.dt.exportCSV();
    }

    loadDemoData() {

        this.giftsService.getGifts().subscribe((data: Gift[]) => (this.gifts = data));
        this.donorsService.getDonors().subscribe((data: Donor[]) => {
            this.donors = data;
            this.donorsNames = this.donors.map(d => d.name || "");

        });

        this.cd.markForCheck();

        this.cols = [
            { field: 'code', header: 'Code', customExportHeader: 'Gifts Code' },
            { field: 'name', header: 'Name' },
            { field: 'image', header: 'Image' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    openNew() {
        this.gift = {};
        this.gift.price = 10
        this.submitted = false;
        this.productDialog = true;
    }





    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    deleteGift(gift2delete: Gift) {
        this.gift = gift2delete
        if(this.gift.users?.length==0)
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + gift2delete.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.giftsService.delete(gift2delete.giftId!).subscribe(
                    () => {
                        this.gifts = this.gifts.filter((val) => val.giftId !== gift2delete.giftId);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Gift deleted successfully',
                            life: 3000,
                        });
                    },
                );
            },
        });
        else{
            this.messageService.add({
                severity: 'warn',
                summary: 'Deletion Not Allowed',
                detail: `Cannot delete ${gift2delete.name} because it has associated users.`,
                life: 3000,
            });
        }
    }



    editGift(gift: Gift) {
        this.gift = { ...gift };
        this.productDialog = true;
    }
    addGift() {
        const duplicateGift = this.gifts.find(g => g.name == this.gift.name)

        if (duplicateGift) {
            this.message = "duplicate gift"
        }
        else {
            this.gift.users = []
            this.giftsService.add(this.gift).subscribe(
                (data) => {
                    this.gift.giftId = data.toString()
                    this.gifts.push(this.gift);
                    this.gifts = [...this.gifts];
                    this.gift = {};

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Gift added successfully',
                        life: 3000,
                    });
                },
                (error) => {
                    console.error('Error adding gift:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to add gift',
                        life: 3000,
                    });
                }
            );
            this.message = ""
            this.productDialog = false
        }
    }

    updateGift() {
        const duplicateGift = this.gifts.find(g => g.name == this.gift.name)
        if(!duplicateGift || duplicateGift.giftId==this.gift.giftId) {
            if (this.gift.giftId)
                this.giftsService.update(this.gift.giftId, this.gift).subscribe(
                    () => {
                        this.gifts = this.gifts.map((g) =>
                            g.giftId === this.gift.giftId ? g = this.gift : g
                        );
                        this.gifts = [...this.gifts];
                        this.gift = {};
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Gift updated successfully',
                            life: 3000,
                        });
                    },
                    (error) => {
                        console.error('Error updating gift:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to update gift',
                            life: 3000,
                        });
                    }
                );
            this.message = ""
            this.productDialog = false 
        }
        else {
                this.message="Duplicate gift"
        }
    }
    saveGifts() {
        this.submitted = true;

        if (this.gift.name?.trim() && this.gift.donor && this.gift.price) {
            if (this.gift.giftId) {
                this.updateGift()
            } else {
                this.addGift()
            }
        }
        else{
            this.message="All fields are required"
        }

    }
}