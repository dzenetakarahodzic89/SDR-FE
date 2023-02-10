import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZxBlockModel } from '@zff/zx-block';
import { ZxButtonModel } from '@zff/zx-button';
import { ToastrService } from 'ngx-toastr';
import { MediaObjectRequest, MediaObjectResponse } from '../shared/gallery.model';
import { GalleryService } from '../shared/gallery.service';

@Component({
  selector: 'app-gallery-overview',
  templateUrl: './gallery-overview.component.html',
  styleUrls: ['./gallery-overview.component.scss']
})
export class GalleryOverviewComponent implements OnInit
{

  objectId: number;
  objectType: string;
  headerString: string;
  selectedImage: string = '';
  mediaIsLoading = false;


  objectMedia: MediaObjectResponse;

  blockConfig: ZxBlockModel = new ZxBlockModel({
    hideExpand: true
  });

  public newImageBtn: ZxButtonModel = new ZxButtonModel({
    items: [
      {
        icon: 'fal fa-file-plus',
        action: () => this.router.navigate(['./gallery/' + this.objectType.toLowerCase() + '/' + this.objectId + '/create'])
      },
    ],
  });


  constructor(private galleryService: GalleryService, private route: ActivatedRoute, private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void
  {
    this.route.params.subscribe(params =>
    {
      this.objectId = params['id'];
      this.objectType = params['type'];
      let request = new MediaObjectRequest(params['type'], params['id']);
      this.loadData(request);
    })
  }

  loadData(request: MediaObjectRequest)
  {
    this.mediaIsLoading = true;
    this.galleryService.getMediaForObject(request).subscribe(response =>
    {
      this.objectMedia = response;
      this.headerString = `Gallery for ${response.objectName} (${response.objectType})`;
      this.mediaIsLoading = false;
    }, () => this.mediaIsLoading = false);
  }

  showImage(url: string)
  {
    this.selectedImage = url;
  }

  delete(uuid: string)
  {
    this.galleryService.deleteMediaStoreObject(uuid).subscribe(response =>
    {
      this.toastr.success(`Image (${response}) successfully deleted!`)
      this.loadData(new MediaObjectRequest(this.objectType, this.objectId));
    })
  }

}
