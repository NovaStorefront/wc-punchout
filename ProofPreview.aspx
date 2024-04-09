<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ProofPreview.aspx.cs" Inherits="uStorePunchOut2Go.ProofPreview" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Proof Preview</title>
    <script src="Scripts/jquery-1.9.1.js"></script>
    <style>
        html {
            height: 99%;
            text-align: center;
        }

        body, form {
            height: 100%;
            margin: 0;
            padding: 0;
        }

        #pages-menu {
            max-width: 100%;
            position: absolute;
            width: 100%;
        }

            #pages-menu span {
                cursor: pointer;
                font-size: 18px;
            }

                #pages-menu span.selected {
                    font-weight: bold;
                }

        #preview-object {
            max-height: 100%;
            height: 100%;
        }

        object {
            max-height: 100%;
            max-width: 100%;
        }

            object[type*=pdf] {
                height: 100%;
                width: 100%;
            }
    </style>
    <script>
        function showProof(page) {
            $('[id*=page]').removeClass('selected');
            $('#page' + page).addClass('selected');
            var id = 'ProofPreviewObject';
            $('#' + id).remove();
            var obj = $('<object>')
                .attr({
                    id: id,
                    data: 'Handlers/ProofHandler.ashx'
                                + '?opId=' + <%= ProofService.OrderProduct.OrderProductID %>
                                +'&cId=' + <%= ProofService.CultureId %>
                                +'&page=' + page,
                    type: '<%= ProofService.ContentType %>'
                })
            $('#preview-object').append(obj);
        }
        $(function () {
            showProof(0);
        })
    </script>
</head>
<body>
    <form id="form1" runat="server">
        <% if (ProofService.PagesCount > 1)
           { %>
        <div id="pages-menu">
            <% for (var p = 0; p < ProofService.PagesCount; p++)
               { %>
            <span id="page<%= p %>" onclick="showProof(<%= p %>)"><%= p+1 %></span>
            <% } %>
        </div>
        <% } %>
        <div id="preview-object"></div>
    </form>
</body>
</html>
