$(document).foundation()

var megaRoster = {
  students: [],
  max: 0,

  init: function(listSelector) {
    this.studentList = document.querySelector(listSelector);
    this.listItemTemplate = this.studentList.querySelector('li.template');
    this.listItemTemplate.remove();
    this.setupEventListeners();
    this.load();
  },

  load: function(){
    try{
      var storedRoster = localStorage.getItem('roster');
      if(storedRoster){
        JSON.parse(storedRoster).map(function(student){
          this.addStudent(student, true);
        }.bind(this));
      }
    }
    catch(err){
      return false;
    }
  },

  save: function(){
    try{
      localStorage.setItem('roster', JSON.stringify(this.students));
    }
    catch(err){
      return flase;
    }
  },

  setupTemplates: function(){
    this.studentItemTemplate = this.studentList.querySelector('.student.template');
    this.studentItemTemplate.remove();
  },

  setupEventListeners: function() {
    document.querySelector('form#student_form').onsubmit = this.addStudentViaForm.bind(this);
  },

  addStudentViaForm: function(ev) {
    ev.preventDefault();
    var f = ev.currentTarget;
    this.addStudent({
      id: (this.max + 1),
      name: f.studentName.value
    });
    var listItem = this.buildListItem(student);

    var span = document.createElement('span');
    listItem.className += 'clearfix';
    span.innerText = studentName;
    span.className = 'student-name';
    listItem.appendChild(span);
    this.students.unshift(student)
    this.prependChild(this.studentList, listItem);
  },

  prependChild: function(parent, child) {
    parent.insertBefore(child, parent.firstChild);
  },

  addStudent: function(student, addToEnd){
    if(addToEnd){
      this.students.push(student);
      this.studentList.appendChild(listItem);
    }
    else{
      this.students.unshift(student);
      this.prependChild(this.studentList, listItem);
    }
    this.incrementCounter(student.id);
    this.save();
  },

  incrementCounter: function(id){
    if(id > this.max){
      this.max = id;
    }
  },



  buildListItem: function(studentName) {
    var listItem = this.listItemTemplate.cloneNode(true);
    //listItem.querySelector('.student-name').innerText = studentName;
    listItem.className = listItem.className.replace('hide', '').trim();
    this.activateLinks(listItem);

    return listItem;
  },

  activateLinks: function(listItem){
    listItem.querySelector('a.edit').onclick = this.toggleEditable.bind(this,listItem);
    listItem.querySelector('a.promote').onclick = this.promote.bind(this, listItem);
    listItem.querySelector('a.move-up').onclick = this.moveUp.bind(this, listItem);
    listItem.querySelector('a.move-down').onclick = this.moveDown.bind(this, listItem);
    listItem.querySelector('a.remove').onclick = this.removeStudent.bind(this, listItem);

    listItem.querySelector('form').onsubmit = this.saveStudent.bind(this, listItem);
    listItem.querySelector('button.cancel').onclick = this.toggleEditable.bind(this,listItem)
  },

  findStudentFromItem: function(item){
    var student;
    this.students.map(function(s){
      if(s.id == item.getAttribute('data-id')){
        student = s;
      }
    });
    return student;
  },

  removeStudent: function(listItem, ev){
    if(ev){ev.preventDefault();}
    var id = listItem.getAttribute('data-id');
    this.students = this.students.flter(function(student){
      return student.id != id;
    });
    listItem.remove();
  },

  saveStudent: function(listItem, ev){
    if(ev) {ev.preventDefault();}
    var studentName = listItem.querySelector('form').studentName.value;
    this.findStudentFromItem(listItem).name = studentName;
    this.toggleEditabe(listItem);
    listItem.querySelector('.editable').innerText = studentName;
    this.save();
  },

  buildLink: function(options) {
    if(options.className === undefined){
      options.className ='';
    }
    var link = document.createElement('a');
    link.href = "#";
    link.innerHTML = options.contents;
    link.onclick = options.handler;
    link.className += (options.className || '');
    return link;
  },

  isFirstItem: function(listItem){
    return (listItem === this.studentList.firstElementChild);
  },

  isLastItem: function(listItem){
    return (listItem === this.studentList.lasElementChild);
  },

  toggleEditable: function(listItem, ev){
    if(ev){ev.preventDefault();}
    var el = listItem.querySelector('.editable');
    var actions = listItem.querySelector('.actions');
    var editForm = listItem.querySelector('form');
    if(editForm.className.indexOf('hide') >= 0){
      editForm.studentName.value = el.innerText;
      this.addClassName(el, 'hide');
      this.addClassName(action, 'hide');
      editForm.studentName.select();
    }
    this.addClassName(editFrom, 'hide')
    this.removeClassName(el, 'hide');
    this.removeClassName(actions, 'hide');
  },

  promote: function(listItem, ev){
    var student = this.findStudentFromItem(listItem);
    if(student){
      student.promoted = !student.promoted;
    };
    this.toggleClassName(listItem, 'promoted');
    this.save();
  },

  moveUp: function(listItem, ev){
    if(ev) {ev,preventDefault();}
    var oldIndex = this.student.indexOf(student);
    this.student.splice(oldIndex -1, 0, this.students.splice(oldIndex, 1)[0]);
    if(listItem !== this.studentList.firstElementChild){
      var previousItem = listItem.previousElementSibling;
      this.studentList.insertBefore(listItem, previousItem);
    }
    this.save();
  },

  moveDown: function(listItem, ev){
    if(ev){ev.preventDefault();}
    if(listItem !== this.studentList.lastElementChild){
      this.moveUp(listItem.nextElementSibling);
  }
  },

};
megaRoster.init('#student_list');
