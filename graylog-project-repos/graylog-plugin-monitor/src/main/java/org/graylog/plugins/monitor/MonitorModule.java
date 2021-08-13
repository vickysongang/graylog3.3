package org.graylog.plugins.monitor;

import org.graylog.plugins.monitor.alerts.SampleAlertCondition;
import org.graylog.plugins.monitor.alerts.SampleAlertNotification;
import org.graylog.plugins.monitor.decorator.SampleDecorator;
import org.graylog2.plugin.PluginConfigBean;
import org.graylog2.plugin.PluginModule;

import java.util.Collections;
import java.util.Set;

/**
 * Extend the PluginModule abstract class here to add you plugin to the system.
 */
public class MonitorModule extends PluginModule {
    /**
     * Returns all configuration beans required by this plugin.
     *
     * Implementing this method is optional. The default method returns an empty {@link Set}.
     */
    @Override
    public Set<? extends PluginConfigBean> getConfigBeans() {
        return Collections.emptySet();
    }

    @Override
    protected void configure() {
        /*
         * Register your plugin types here.
         *
         * Examples:
         *
         * addMessageInput(Class<? extends MessageInput>);
         * addMessageFilter(Class<? extends MessageFilter>);
         * addMessageOutput(Class<? extends MessageOutput>);
         * addPeriodical(Class<? extends Periodical>);
         * addAlarmCallback(Class<? extends AlarmCallback>);
         * addInitializer(Class<? extends Service>);
         * addRestResource(Class<? extends PluginRestResource>);
         *
         *
         * Add all configuration beans returned by getConfigBeans():
         *
         * addConfigBeans();
         */

        addAlarmCallback(SampleAlertNotification.class);

        addAlertCondition(SampleAlertCondition.class.getCanonicalName(),
                SampleAlertCondition.class,
                SampleAlertCondition.Factory.class);

        installSearchResponseDecorator(searchResponseDecoratorBinder(),
                SampleDecorator.class,
                SampleDecorator.Factory.class);
    }
}