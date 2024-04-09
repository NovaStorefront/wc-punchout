<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="PostForm.aspx.cs" Inherits="uStorePunchOut2Go.PostForm" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Post PunchOut2Go data</title>
</head>
<body onload="javascript:postForm.submit();">
    <form id="postForm"
        enctype="application/x-www-form-urlencoded"
        action='<%= Url %>'
        method='post'>
        <input type='hidden' name='version' value='1.0' />
        <input type='hidden' name='params' value='<%=Params %>' />
    </form>
</body>
</html>
