<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title inertia>Julawbook</title>

    <!-- Font Awesome -->
    <link rel="stylesheet" href="{{ asset('interface/admin/plugins/fontawesome-free/css/all.min.css')}}">
    <!-- Theme style -->
    <link rel="stylesheet" href="{{ asset('interface/admin/dist/css/adminlte.min.css')}}">
    <!-- overlayScrollbars -->
    <link rel="stylesheet" href="{{ asset('interface/admin/plugins/overlayScrollbars/css/OverlayScrollbars.min.css')}}">
    <!-- Julaw favicon -->
    <link rel="icon" href="{{asset('images/julaw.png')}}" type="image/x-icon" style="border-radius: 15px">
    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <!-- DataTables -->
    <link rel="stylesheet" href="{{ asset('interface/admin/plugins/DataTables/DataTables-1.10.25/css/dataTables.bootstrap5.min.css')}}">
    <link rel="stylesheet" href="{{ asset('interface/admin/plugins/DataTables/Responsive-2.2.9/css/responsive.bootstrap5.min.css')}}">
    <link rel="stylesheet" href="{{ asset('interface/admin/plugins/DataTables/Buttons-1.7.1/css/buttons.bootstrap5.min.css')}}">
    <!-- Date picker -->
    <link href="{{ asset('interface/mc-datepicker/dist/mc-calendar.min.css') }}" rel="stylesheet"/>

    <link rel="stylesheet" href="{{ asset('css/main.css') }}" />
    <!-- Drag and drop file upload -->
    <link href="{{ asset('interface/uploader-master/dist/css/jquery.dm-uploader.min.css') }}" rel="stylesheet">
    <link href="{{ asset('interface/uploader-master/demo/styles.css') }}" rel="stylesheet">

    <script src="{{ asset('js/helper.js') }}"></script>
    <!--// prev -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css" />
    <script>
        const remember = window.localStorage
    </script>

    @routes
    @viteReactRefresh
    @vite('resources/js/app.jsx')
    @inertiaHead
</head>
<body class="font-sans antialiased bg-light" onload="window.localStorage.clear()">
@inertia
<aside class="control-sidebar control-sidebar-dark"></aside>

<script src="{{ asset('interface/admin/plugins/jquery/jquery.min.js')}}"></script>
<!-- Bootstrap 5 -->
<!-- JavaScript Bundle with Popper -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-u1OknCvxWvY5kfmNBILK2hRnQC3Pr17a+RTT6rIHI7NnikvbZlHgTPOOmMi466C8" crossorigin="anonymous"></script>

<!-- DataTables -->
<script src="{{ asset('interface/admin/plugins/DataTables/DataTables-1.10.25/js/jquery.dataTables.min.js') }}"></script>
<script src="{{ asset('interface/admin/plugins/DataTables/DataTables-1.10.25/js/dataTables.bootstrap5.min.js') }}"></script>
<script src="{{ asset('interface/admin/plugins/DataTables/Responsive-2.2.9/js/dataTables.responsive.min.js') }}"></script>
<script src="{{ asset('interface/admin/plugins/DataTables/Responsive-2.2.9/js/responsive.bootstrap5.min.js') }}"></script>
<script src="{{ asset('interface/admin/plugins/DataTables/Buttons-1.7.1/js/dataTables.buttons.min.js') }}"></script>
<script src="{{ asset('interface/admin/plugins/DataTables/Buttons-1.7.1/js/buttons.bootstrap5.min.js') }}"></script>
{{--    <script src="{{ asset('interface/admin/plugins/DataTables/JSZip-2.5.0/jszip.min.js') }}"></script>--}}
{{--    <script src="{{ asset('interface/admin/plugins/DataTables/pdfmake-0.1.36/pdfmake.min.js') }}"></script>--}}
{{--    <script src="{{ asset('interface/admin/plugins/DataTables/pdfmake-0.1.36/vfs_fonts.js') }}"></script>--}}
<script src="{{ asset('interface/admin/plugins/DataTables/Buttons-1.7.1/js/buttons.html5.min.js') }}"></script>
<script src="{{ asset('interface/admin/plugins/DataTables/Buttons-1.7.1/js/buttons.print.min.js') }}"></script>
<script src="{{ asset('interface/admin/plugins/DataTables/Buttons-1.7.1/js/buttons.colVis.min.js') }}"></script>
<!-- MC-calender -->
<script src="{{ asset('interface/mc-datepicker/dist/mc-calendar.min.js') }}"></script>
<!-- Main js -->
{{--<script src="{{ asset('js/main.js') }}"></script>--}}
<!-- Notify.js -->
<script src="{{ asset('interface/admin/plugins/notify.min.js')}}"></script>
<!-- overlayScrollbars (scrollbars indeed) -->
<script src="{{ asset('interface/admin/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js')}}"></script>
<!-- AdminLTE App (hosts main.js for the app)-->
<script src="{{ asset('interface/admin/dist/js/adminlte.min.js')}}"></script>
<!-- AdminLTE for demo purposes (hosts the left sidebar settings)-->
<script src="{{ asset('interface/admin/dist/js/demo.js')}}"></script>
<!-- Drag and drop upload -->
<script src="{{ asset('interface/uploader-master/src/js/jquery.dm-uploader.js') }}"></script>
<script src="{{ asset('interface/uploader-master/src/js/ui-multiple.js') }}"></script>
<script src="{{ asset('interface/uploader-master/src/js/controls.js') }}"></script>
</body>
</html>
