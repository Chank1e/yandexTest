$(document).ready(function(){
  $("#phoneInput").mask('+7(000)000-00-00');
  $('#mainForm').submit(function(e){
    e.preventDefault();
    var phone = $("#phoneInput").cleanVal(),
        phoneNotClean = $("#phoneInput").val(),
        email = $('#emailInput').val(),
        fioI = $('#fioInput').val(),
        isValFio=false,
        isValEmail=false,
        isValPhone=false;

//console.log(fio,email,phone);
    //$('#submitButton').prop('disabled',true);

    //IF ALL IS VALID
    function requestJson(){
      $.getJSON($('#mainForm').attr('action'))
       .done(function(data) {
         $('#submitButton').prop('disabled',false);
         if(data.status=='success'){
           $('#resultContainer').text(data.status).attr('class','success');
         } else if(data.status=='error'){
           $('#resultContainer').text(data.reason).attr('class','error');
         } else if(data.status=='progress'){
           $('#resultContainer').attr('class','progress');
           setTimeout(requestJson,data.timeout);
         }
      });
    };
  function isValidForm(){
    let errFlds = [];
    //FIO VALIDATION
    fio = fioI.replace(/\s{2,}/g, ' ').match(/\s/g);
    //let regExpFio = /[а-яA-ЯёЁ]+\s[а-яA-ЯёЁ]+\s[а-яA-ЯёЁ]+/;
    if(fio!=null){
        if(fio.length===2){
          isValFio=true;
          $('#fioInput').css('border','1px solid rgba(0,0,0,.15)')
        } else {
          isValFio=false;
          errFlds.push('fio');
          $('#fioInput').css('border','1px solid red')
        }
    }  else {
      isValFio=false;
      errFlds.push('fio');
      $('#fioInput').css('border','1px solid red')
    }


    //EMAIL VALIDATION
    let regExpYandex = /^[a-z]((\.|-){0,1}[a-z|0-9])+(\.|-){0,1}[a-z|0-9]\@(ya\.ru|yandex\.(ru|ua|by|kz|com))$/;
    if(regExpYandex.test(email)){
      isValEmail=true;
      $('#emailInput').css('border','1px solid rgba(0,0,0,.15)')
    } else {
      isValEmail=false;
      errFlds.push('email');
      $('#emailInput').css('border','1px solid red')
    }


    //PHONE VALIDATION
    let sum=7;
    let regExpPhone = /\+7\(\d{3}\)\d{3}\-\d{2}\-\d{2}/;
    if (regExpPhone.test(phoneNotClean)){
        phone.split('').forEach((i)=>{
          sum+=parseInt(i);
        });
        if(sum<=30){
          isValPhone=true;
          $('#phoneInput').css('border','1px solid rgba(0,0,0,.15)')
        } else {
          isValPhone=false;
          errFlds.push('phone');
          $('#phoneInput').css('border','1px solid red');
        };
      } else{
        isValPhone=false;
        errFlds.push('phone');
        $('#phoneInput').css('border','1px solid red');
      }
    return {'isValid':isValPhone&&isValFio&&isValEmail,'errorFields':errFlds};
  };

    if(isValidForm().isValid){
      $('#submitButton').prop('disabled',true);
      MyForm.isValid=true;
      MyForm.errorFields=[];
      requestJson();
    } else {
      MyForm.isValid=false;
      MyForm.errorFields=isValidForm().errorFields;
    }

  });
});
var MyForm = {
  isValid:false,
  errorFields:[],
  validate:function(){
    return {
      'isValid':this.isValid,
      'errorFields':this.errorFields
    }
  },
  getData:function(){
    fio=$('#fioInput').val();
    email=$('#emailInput').val();
    phone=$('#phoneInput').cleanVal();
    return {
      'fio':fio,
      'email':email,
      'phone':phone
    }
  },
  setData:function(obj){
    if(typeof(obj)=='object'){
      for(key in obj){
        if(key=='fio'){
          $('#fioInput').val(obj[key]);
        } else if(key=='email'){
          $('#emailInput').val(obj[key]);
        } else if(key=='phone'){
          $('#phoneInput').val(obj[key]);
        }
      }
    }
  },
  submit:function(){
      $('#mainForm').submit();
  }
};
