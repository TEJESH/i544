
<!DOCTYPE html>
<html>
  <head>
    <title>User Search</title>
    <link rel="stylesheet" href="/css/style.css">
  </head>
  <body>
    <h1>Users Search</h1>
    {{#errors}}
      <p class="error">{{.}}</p>
    {{/errors}}
    <p>
      Please fill in one or more of the following fields
    </p>
    <form method="GET" action="/search/users">
      {{#fields}}
    	  {{#isSearch}}
    	    <label>
    	    <span class="label">{{friendlyName}}:</span>
    	    <input name="{{name}}" {{#type}}type="{{type}}"{{/type}}
    	           value="{{value}}">
    	    </label>
    	    <br/>
    	    {{#errorMessage}}
    	      <span class="error">{{errorMessage}}</span><br/>
    	    {{/errorMessage}}
    	  {{/isSearch}}
    	 {{/fields}}
          <input name="submit" type="submit" value="search" class="control">
        </form>
        {{>footer}}
    <script src="/js/min-user-id-chk.js"></script>
  </body>
</html>
