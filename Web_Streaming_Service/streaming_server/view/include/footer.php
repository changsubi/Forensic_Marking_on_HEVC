<footer>
    <?php
    $custom = "";
    $extraPluginFile = $global['systemRootPath'] . 'plugin/Customize/Objects/ExtraConfig.php';
    if (file_exists($extraPluginFile) && AVideoPlugin::isEnabled("c4fe1b83-8f5a-4d1b-b912-172c608bf9e3")) {
        require_once $extraPluginFile;
        $ec = new ExtraConfig();
        $custom = $ec->getFooter();
    }
    if (empty($custom)) {
        ?>
        <ul class="list-inline">
            <li>
                Powered by <a href="http://www.wkit.co.kr/renew/" class="external btn btn-outline btn-primary btn-xs" target="_blank" rel="noopener noreferrer">WKIT®</a> - <a href="http://www.wkit.co.kr/renew/" class="external btn btn-outline btn-primary btn-xs" target="_blank" rel="noopener noreferrer">A Streaming Platform v<?php echo $config->getVersion(); ?></a>
            </li>
            <li>
                <a href="http://www.wkit.co.kr/renew/" class="external btn btn-outline btn-primary btn-xs" target="_blank" rel="noopener noreferrer"><span class="sr-only">Facebook</span><i class="fab fa-facebook-square"></i></a>
            </li>
        </ul>
        <?php
    } else {
        echo $custom;
    }
    ?>
</footer>
<script>
    $(function () {
<?php
if (!empty($_GET['error'])) {
    ?>
            swal({title: "Sorry!", text: "<?php echo $_GET['error']; ?>", icon: "error", html: true});
    <?php
}
?>
<?php
if (!empty($_GET['msg'])) {
    ?>
            swal({title: "Ops!", text: "<?php echo $_GET['msg']; ?>", icon: "info", html: true});
    <?php
}
?>
<?php
if (!empty($_GET['success']) && strlen($_GET['success']) > 4) {
    ?>
            swal({title: "<?php echo __("Congratulations"); ?>", text: "<?php echo $_GET['success']; ?>", icon: "success", html: true});
    <?php
}
?>
    });
</script>
<!-- <script src="<?php echo $global['webSiteRootURL']; ?>bootstrap/js/bootstrap.min.js" type="text/javascript"></script> -->
<script src="<?php echo $global['webSiteRootURL']; ?>view/js/jquery.lazy/jquery.lazy.min.js" type="text/javascript"></script>
<script src="<?php echo $global['webSiteRootURL']; ?>view/js/jquery.lazy/jquery.lazy.plugins.min.js" type="text/javascript"></script>
<script src="<?php echo $global['webSiteRootURL']; ?>view/js/script.js?<?php echo filectime("{$global['systemRootPath']}view/js/script.js"); ?>" type="text/javascript"></script>
<?php
$jsFiles = array();
//$jsFiles[] = "view/js/jquery.lazy/jquery.lazy.min.js";
//$jsFiles[] = "view/js/jquery.lazy/jquery.lazy.plugins.min.js";
//$jsFiles[] = "view/js/script.js";
$jsFiles[] = "view/js/jquery-ui/jquery-ui.min.js";
$jsFiles[] = "view/bootstrap/js/bootstrap.min.js";
$jsFiles[] = "view/js/seetalert/sweetalert.min.js";
$jsFiles[] = "view/js/bootpag/jquery.bootpag.min.js";
$jsFiles[] = "view/js/bootgrid/jquery.bootgrid.js";
$jsFiles[] = "view/bootstrap/bootstrapSelectPicker/js/bootstrap-select.min.js";
//$jsFiles[] = "view/js/bootstrap-toggle/bootstrap-toggle.min.js";
$jsFiles[] = "view/js/jquery.bootstrap-autohidingnavbar.min.js";
$jsFiles[] = "view/css/flagstrap/js/jquery.flagstrap.min.js";
$jsFiles[] = "view/js/webui-popover/jquery.webui-popover.min.js";
$jsFiles[] = "view/js/bootstrap-list-filter/bootstrap-list-filter.min.js";
$jsFiles[] = "view/js/js-cookie/js.cookie.js";
if (!empty($video['type'])) {

    $waveSurferEnabled = AVideoPlugin::getObjectDataIfEnabled("CustomizeAdvanced");
    if ($waveSurferEnabled == false) {
        $waveSurferEnabled = true;
    } else {
        $waveSurferEnabled = $waveSurferEnabled->EnableWavesurfer;
    }
    if ((($video['type'] == "audio") || ($video['type'] == "linkAudio")) && ($waveSurferEnabled)) {
        $jsFiles[] = "view/js/videojs-wavesurfer/wavesurfer.min.js";
        $jsFiles[] = "view/js/videojs-wavesurfer/dist/videojs.wavesurfer.min.js";
    }
}
$jsFiles = array_merge($jsFiles, AVideoPlugin::getJSFiles());
$jsURL = combineFiles($jsFiles, "js");
?>
<script src="<?php echo $jsURL; ?>" type="text/javascript"></script>
<?php
require_once $global['systemRootPath'] . 'plugin/AVideoPlugin.php';
?>
<div id="pluginFooterCode">
    <?php
    echo AVideoPlugin::getFooterCode();
    ?>
</div>
<?php
if (isset($_SESSION['savedQuerys'])) {
    echo "<!-- Saved querys: " . $_SESSION['savedQuerys'] . " -->";
}
if (!empty($advancedCustom->footerHTMLCode->value)) {
    echo $advancedCustom->footerHTMLCode->value;
}
?>
<textarea id="elementToCopy" style="
          filter: alpha(opacity=0);
          -moz-opacity: 0;
          -khtml-opacity: 0;
          opacity: 0;
          position: absolute;
          z-index: -9999;
          top: 0;
          left: 0;
          pointer-events: none;"></textarea>
