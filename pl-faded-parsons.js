/* eslint-env jquery, browser */

const ParsonsGlobal = {
  makeLogger: false,
  logger: null,
  widget: null,
  /*
   * When form is submitted, capture the state of the student's solution.
   * For now we only submit the actual code, NOT the original metadata of where the blanks were etc.
   */
  submitHandler: function() {
    var starterCode = $("#ul-starter-code li");
    const starterElements = [];
    starterCode.each(function(idx, li) {
        var id = $(li).attr('id');
        var indent = $(li).css('margin-left');
        starterElements.push({'id': id, 'indent': indent, 'index': idx})
    });
    $('#starter-code-order').val(JSON.stringify(starterElements));

    var solutionCode = $("#ul-parsons-solution li");
    const solutionElements = [];
    solutionCode.each(function(idx, li) {
        var id = $(li).attr('id');
        var indent = $(li).css('margin-left');
        solutionElements.push({'id': id, 'indent': indent, 'index': idx})
    });
    $('#parsons-solution-order').val(JSON.stringify(solutionElements));
    $('#student-parsons-solution').val(ParsonsGlobal.widget.solutionCode()[0]);

    ParsonsGlobal.logger && ParsonsGlobal.logger.onSubmit();
  },

  /* When blanks are filled in adjust their length */
  adjustBlankWidth: function() {
    $(this).width( this.value.length.toString() + 'ch');
  },

  /*
   * Initialize the widget.  Code that goes in left-hand box will be in
   * the hidden form field  named 'code-lines'.
   * For now, no logging of events is done.
   */
  setup: function() {
    ParsonsGlobal.widget = new ParsonsWidget({
      'sortableId': 'parsons-solution',
      'onSortableUpdate': (event, ui) => {
        ParsonsGlobal.logger && ParsonsGlobal.logger.onSortableUpdate(event, ui);
      },
      'onBlankUpdate': (event, codeline) => {
        ParsonsGlobal.logger && ParsonsGlobal.logger.onTextUpdate(event, codeline);
      },
      'trashId': 'starter-code',
      'max_wrong_lines': 1,
      'trash_label': "Drag from here into the (yellow) solution box, including indents",
      'solution_label' : "",
      'syntax_language': 'lang-py' // lang-rb and other choices also acceptable
    });
    const codeLinesValue = $('#code-lines').val();
    // console.log(codeLinesValue);
    ParsonsGlobal.widget.init(codeLinesValue);
    ParsonsGlobal.widget.alphabetize();  // this should depend on attribute settings
    // when blanks are filled, adjust their width
    $('input.text-box').on('input', ParsonsGlobal.adjustBlankWidth);
    // when form submitted, grab the student work and put it into hidden form fields
    $('form.question-form').submit(ParsonsGlobal.submitHandler);

    if (ParsonsGlobal.makeLogger && (typeof ParsonsLogger !== 'undefined') && !ParsonsGlobal.logger) {
      ParsonsGlobal.logger = new ParsonsLogger(ParsonsGlobal.widget);
    }
  }
}

$(document).ready(ParsonsGlobal.setup);
