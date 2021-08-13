package org.graylog.plugins.monitor;

import org.graylog2.plugin.PluginMetaData;
import org.graylog2.plugin.ServerStatus;
import org.graylog2.plugin.Version;

import java.net.URI;
import java.util.Collections;
import java.util.Set;

/**
 * Implement the PluginMetaData interface here.
 */
public class MonitorMetaData implements PluginMetaData {
    private static final String PLUGIN_PROPERTIES = "org.graylog.plugins.graylog-plugin-monitor/graylog-plugin.properties";

    @Override
    public String getUniqueId() {
        return "org.graylog.plugins.monitor.MonitorPlugin";
    }

    @Override
    public String getName() {
        return "Monitor";
    }

    @Override
    public String getAuthor() {
        return "Song Ang <angsong@wizteco.com>";
    }

    @Override
    public URI getURL() {
        return URI.create("https://github.com/Graylog2/graylog-plugin-sample");
    }

    @Override
    public Version getVersion() {
        return Version.fromPluginProperties(getClass(), PLUGIN_PROPERTIES, "version", Version.from(0, 0, 0, "unknown"));
    }

    @Override
    public String getDescription() {
        // TODO Insert correct plugin description
        return "Monitor Kong .etc";
    }

    @Override
    public Version getRequiredVersion() {
        return Version.fromPluginProperties(getClass(), PLUGIN_PROPERTIES, "graylog.version", Version.from(0, 0, 0, "unknown"));
    }

    @Override
    public Set<ServerStatus.Capability> getRequiredCapabilities() {
        return Collections.emptySet();
    }
}
