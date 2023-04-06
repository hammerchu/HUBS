import { Component, OnInit } from '@angular/core';
import {
  // core locale
  locale_en_gb,

  // plugin locale
  plugin_crop_locale_en_gb,
  plugin_finetune_locale_en_gb,
  plugin_filter_locale_en_gb,
  plugin_annotate_locale_en_gb,
  plugin_decorate_locale_en_gb,
  plugin_redact_locale_en_gb,
  plugin_resize_locale_en_gb,
  plugin_sticker_locale_en_gb,
  plugin_frame_locale_en_gb,

  // markup editor locale
  markup_editor_locale_en_gb,
} from '@pqina/pintura';

@Component({
  selector: 'app-asset',
  templateUrl: './asset.page.html',
  styleUrls: ['./asset.page.scss'],
})
export class AssetPage implements OnInit {

  constructor() { }

  ngOnInit() {
    this.loadLocate()
  }

  content:any;
  loadLocate(){

    // // log merged objects to console
    // this.content = [...locale_en_gb,
    //   ...plugin_crop_locale_en_gb,
    //   ...plugin_finetune_locale_en_gb,
    //   ...plugin_filter_locale_en_gb,
    //   ...plugin_annotate_locale_en_gb,
    //   ...plugin_decorate_locale_en_gb,
    //   ...plugin_resize_locale_en_gb,
    //   ...plugin_sticker_locale_en_gb,
    //   ...markup_editor_locale_en_gb,]
  console.log({
      ...locale_en_gb,
      ...plugin_crop_locale_en_gb,
      ...plugin_finetune_locale_en_gb,
      ...plugin_filter_locale_en_gb,
      ...plugin_annotate_locale_en_gb,
      ...plugin_decorate_locale_en_gb,
      ...plugin_resize_locale_en_gb,
      ...plugin_sticker_locale_en_gb,
      ...markup_editor_locale_en_gb,
  });
  }
}
