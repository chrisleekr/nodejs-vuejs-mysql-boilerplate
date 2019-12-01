export default class Setting {
  static metaTypes = {
    select: 'select',
    number: 'number',
    text: 'text'
  };

  static isPublicTypes = {
    public: 1,
    private: 0
  };

  constructor({ rowNum, id, metaKey, metaName, metaType, metaDesc, metaAttribute, metaValue, isPublic }) {
    this.rowNum = rowNum || null;
    this.id = id;
    this.metaKey = metaKey;
    this.metaName = metaName;
    this.metaDesc = metaDesc;
    this.metaType = metaType;
    this.metaAttribute = metaAttribute;
    this.metaValue = metaValue;
    this.isPublic = isPublic;

    this.expand();
  }

  expand() {
    this.settingName = `${this.metaName} <span class="span-help-text">(${this.metaKey})</span><br /><span class="span-help-text">${this.metaDesc}</span>`;
  }
}
