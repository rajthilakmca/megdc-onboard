import Ember from 'ember';

/**
 * @module ivy-tabs
 */

/**
 * @class IvyTabComponent
 * @namespace IvyTabs
 * @extends Ember.Component
 */
export default Ember.Component.extend({
  tagName: 'li',
  attributeBindings: ['aria-controls', 'aria-expanded', 'aria-selected', 'selected', 'tabindex'],
  classNames: [],
  classNameBindings: ['active'],

  init() {
    this._super(...arguments);
    Ember.run.once(this, this._registerWithTabList);
  },

  willDestroy() {
    this._super(...arguments);
    Ember.run.once(this, this._unregisterWithTabList);
  },

  /**
   * Tells screenreaders which panel this tab controls.
   *
   * See http://www.w3.org/TR/wai-aria/states_and_properties#aria-controls
   *
   * @property aria-controls
   * @type String
   * @readOnly
   */
  'aria-controls': Ember.computed.readOnly('tabPanel.elementId'),

  /**
   * Tells screenreaders whether or not this tab's panel is expanded.
   *
   * See http://www.w3.org/TR/wai-aria/states_and_properties#aria-expanded
   *
   * @property aria-expanded
   * @type String
   * @readOnly
   */
  'aria-expanded': Ember.computed.readOnly('aria-selected'),

  /**
   * Tells screenreaders whether or not this tab is selected.
   *
   * See http://www.w3.org/TR/wai-aria/states_and_properties#aria-selected
   *
   * @property aria-selected
   * @type String
   */
  'aria-selected': Ember.computed('isSelected', function() {
    return this.get('isSelected') + ''; // coerce to 'true' or 'false'
  }),

  /**
   * The `role` attribute of the tab element.
   *
   * See http://www.w3.org/TR/wai-aria/roles#tab
   *
   * @property ariaRole
   * @type String
   * @default 'tab'
   */
  ariaRole: 'tab',

  /**
   * The `selected` attribute of the tab element. If the tab's `isSelected`
   * property is `true` this will be the literal string 'selected', otherwise
   * it will be `undefined`.
   *
   * @property selected
   * @type String
   */
  selected: Ember.computed('isSelected', function() {
    if (this.get('isSelected')) { return 'selected'; }
  }),

  /**
   * Makes the selected tab keyboard tabbable, and prevents tabs from getting
   * focus when clicked with a mouse.
   *
   * @property tabindex
   * @type Number
   */
  tabindex: Ember.computed('isSelected', function() {
    if (this.get('isSelected')) { return 0; }
  }),

  /**
   * Accessed as a className binding to apply the tab's `activeClass` CSS class
   * to the element when the tab's `isSelected` property is true.
   *
   * @property active
   * @type String
   * @readOnly
   */
  active: Ember.computed('isSelected', function() {
    if (this.get('isSelected')) { return this.get('activeClass'); }
  }),

  /**
   * The CSS class to apply to a tab's element when its `isSelected` property
   * is `true`.
   *
   * @property activeClass
   * @type String
   * @default 'active'
   */
  activeClass: 'active',

  /**
   * The index of this tab in the `ivy-tab-list` component.
   *
   * @property index
   * @type Number
   */
  index: Ember.computed('tabs.[]', function() {
    return this.get('tabs').indexOf(this);
  }),

  /**
   * Whether or not this tab is selected.
   *
   * @property isSelected
   * @type Boolean
   */
  isSelected: Ember.computed('tabList.selectedTab', function() {
    return this.get('tabList.selectedTab') === this;
  }),

  /**
   * Called when the user clicks on the tab. Selects this tab.
   *
   * @method select
   */
  select: Ember.on('click', 'touchEnd', function() {
    this.get('tabList').selectTab(this);
  }),

  /**
   * The `ivy-tab-list` component this tab belongs to.
   *
   * @property tabList
   * @type IvyTabs.IvyTabListComponent
   * @default null
   */
  tabList: null,

  /**
   * The `ivy-tab-panel` associated with this tab.
   *
   * @property tabPanel
   * @type IvyTabs.IvyTabPanelComponent
   */
  tabPanel: Ember.computed('tabPanels.[]', 'index', function() {
    return this.get('tabPanels').objectAt(this.get('index'));
  }),

  /**
   * The array of all `ivy-tab-panel` instances within the `ivy-tabs`
   * component.
   *
   * @property tabPanels
   * @type Array | IvyTabs.IvyTabPanelComponent
   * @readOnly
   */
  tabPanels: Ember.computed.readOnly('tabsContainer.tabPanels'),

  /**
   * The array of all `ivy-tab` instances within the `ivy-tab-list` component.
   *
   * @property tabs
   * @type Array | IvyTabs.IvyTabComponent
   * @readOnly
   */
  tabs: Ember.computed.readOnly('tabList.tabs'),

  /**
   * The `ivy-tabs` component.
   *
   * @property tabsContainer
   * @type IvyTabs.IvyTabsComponent
   * @readOnly
   */
  tabsContainer: Ember.computed.readOnly('tabList.tabsContainer'),

  _registerWithTabList() {
    this.get('tabList').registerTab(this);
  },

  _unregisterWithTabList() {
    this.get('tabList').unregisterTab(this);
  }
});
