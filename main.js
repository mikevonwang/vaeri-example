class App extends Vaeri {

  constructor() {
    super();
    this.state = {
      new_list_item_name: '',
      items: [],
    };
  }

  getDOM() {
    return ({
      list: ['ul.shopping_list', {
        items: [['> li'], {
          button_delete: ['button.delete'],
        }]
      }],
      new_input: ['div.new_item input'],
      new_button: ['div.new_item button.add'],
    });
  }

  setListeners() {
    return ({
      list: [null, {
        items: [[['click', this.onClickListItem]], {
          button_delete: [[['click', this.onClickListItemDeleteButton]]],
        }],
      }],
      new_button: [[['click', this.onClickNewButton]]],
    });
  }

  onMount() {
    const new_items = [
      {name: 'Apples', in_cart: false},
      {name: 'Bacon', in_cart: false},
      {name: 'Olive oil', in_cart: false},
    ];
    this.doAction('didReceiveData', {
      items: new_items,
    }, [new_items]);
  }

  didReceiveData(new_items) {
    this.dom.list.items.populate(new_items, (c,i) => {
      this.dom.list.items[i].insertAdjacentHTML('afterbegin', c.name);
    });
  }

  onClickListItem(event, item, index) {
    const NSI = {
      items: this.state.items.map((c,i) => {
        if (i === index) {
          return Object.assign({}, c, {
            in_cart: !c.in_cart,
          });
        }
        else {
          return c;
        }
      }),
    };
    this.doAction('didClickListItem', NSI, [index]);
  }

  didClickListItem(index) {
    this.dom.list_items[index].classList.toggle('in_cart');
  }

  onClickNewButton() {
    const name = this.dom.new_input.value;
    if (name.length > 0) {
      const new_item = {
        name: name,
        in_cart: false,
      };
      const NSI = {
        items: [...this.state.items, new_item],
      };
      this.doAction('didClickNewButton', NSI, [new_item]);
    }
  }

  didClickNewButton(new_item) {
    this.dom.new_input.value = '';
    const new_list_item = this.makeListItem(new_item);
    this.dom.list.insertAdjacentHTML('beforeEnd', new_list_item);
    this.dom.list_items.populate();
    this.dom.list_item_delete_buttons.populate();
  }

  onClickListItemDeleteButton(event, item, index) {
    const NSI = {
      items: this.state.items.filter((c,i) => {
        if (i === index) {
          return false;
        }
        else {
          return true;
        }
      }),
    };
    this.doAction('didClickListItemDeleteButton', NSI, [index]);
    event.stopPropagation();
  }

  didClickListItemDeleteButton(index) {
    this.dom.list_items[index].remove();
    this.dom.list_items.delete(index);
  }

};

var app = new App();
